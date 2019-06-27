import React from 'react';
import ReactGA from 'react-ga';
import configuration from '../config/configuration';
import Canvas, { showText, clearCanvas } from './Canvas';
import { generateSnake, isInside, renderSnake, collisions } from '../core/Snake';
import { CONTROLS, handleKeyboard, isNotOpposite, keyboardSnake } from '../core/Controls';
import * as styles from '../styles/variables.scss';
import Score from './Score';
import * as FontFaceObserver from 'fontfaceobserver';

export const Status  = {
    PAUSE : { value : 'PAUSE', key : "'space'", text: "pause"},
    PLAY : { value : 'PLAY', key : "'space'", text: "play"},
    GAMEOVER : { value : 'GAME OVER', key : "'r'", text: "replay"},
}

const delay = 100;

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            snake_one_name: "Persifleur",
            snake_one_color: styles.blue,
            snake_one: generateSnake('LEFT'),
            snake_two_name: "Juju",
            snake_two_color: styles.pink,
            snake_two: generateSnake('RIGHT'),
            snake_one_score: 0,
            snake_two_score: 0,
            key_snake_one: keyboardSnake('ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'),
            key_snake_two: keyboardSnake('z', 's', 'q', 'd'),
            keypressed_snake_one: CONTROLS.UP,
            keypressed_snake_two: CONTROLS.DOWN,
            status: Status.PLAY,
        };
    }

    componentWillUnmount = () => {
        clearInterval(this.intervalID);
    }

    componentDidMount = async () => {
        // Configuration Google Analytics
        ReactGA.initialize(configuration.googleAnalyticsTrackingId);
        ReactGA.pageview(window.location.pathname + window.location.search);

        // Permet de charger ma police d'écriture personnalisé
        this.font = await new FontFaceObserver('nokiafc22').load();
        // Personnalisation de notre canvas (titre)
        showText(this.font, "🐍 | Press the space bar to play | 🐍");

        document.addEventListener('keydown', (event) => {
            if([32, 37, 38, 39, 40].indexOf(event.keyCode) > -1) {
                event.preventDefault();
            }

            if((this.state.status !== Status.GAMEOVER) && event.key === " ") {
                if(this.state.status === Status.PLAY) {
                    this.intervalID = setInterval(this.tick, delay);
                    this.setState({
                        status: Status.PAUSE
                    });
                } else {
                    clearInterval(this.intervalID);
                    this.setState({
                        status: Status.PLAY
                    });
                }
            }

            if(event.key === "r") {
                clearInterval(this.intervalID);
                this.intervalID = setInterval(this.tick, delay);
                this.setState({ 
                    snake_one: generateSnake('LEFT'),
                    snake_two: generateSnake('RIGHT'),
                    snake_one_score: this.state.snake_one_score,
                    snake_two_score: this.state.snake_two_score,
                    key_snake_one: keyboardSnake('ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'),
                    key_snake_two: keyboardSnake('z', 's', 'q', 'd'),
                    keypressed_snake_one: CONTROLS.UP,
                    keypressed_snake_two: CONTROLS.DOWN,
                });
            }

            this.key_snake_one = handleKeyboard(event, this.state.key_snake_one);
            this.key_snake_two = handleKeyboard(event, this.state.key_snake_two);
        }, false);
    }

    // Lorsque l'on a perdu
    finish(snake) {
        var { snake_one_score, snake_two_score, snake_one_name, snake_two_name } = this.state, winner;
        (snake !== 0) ? snake_one_score += 1 : snake_two_score += 1;
        (snake === 0) ? winner = snake_two_name : winner = snake_one_name;
        showText(this.font, "🏆 | " + winner + " WIN - Press 'r' to play again | 🏆");
        this.setState({ 
            status: Status.GAMEOVER,
            snake_one_score: snake_one_score,
            snake_two_score: snake_two_score
        });
        return clearInterval(this.intervalID);
    }

    // 
    tick = () => {
        // Si le jeu est terminé
        if(this.state.status === Status.GAMEOVER.value) { return }
        
        // Le jeu n'est pas terminé, on réucpère l'état de notre jeu
        var { snake_one, score, keypressed_snake_one, snake_two, keypressed_snake_two } = this.state;
        
        // On vérifie que le serpent ne peut revenir sur son chemin
        if(this.key_snake_one !== undefined && isNotOpposite(this.key_snake_one, keypressed_snake_one)) {
            keypressed_snake_one = this.key_snake_one
        };

        // On vérifie que le serpent ne peut revenir sur son chemin
        if(this.key_snake_two !== undefined && isNotOpposite(this.key_snake_two, keypressed_snake_two)) {
            keypressed_snake_two = this.key_snake_two
        };

        // On fait avancer nos serpent
        var head_one = { x : snake_one[0].x + (10 * keypressed_snake_one.x), y : snake_one[0].y + (10 * keypressed_snake_one.y) };
        var head_two = { x : snake_two[0].x + (10 * keypressed_snake_two.x), y : snake_two[0].y + (10 * keypressed_snake_two.y) };

        // Permet de vérifier que les deux serpents ne soient pas superposés
        if(JSON.stringify(head_one) === JSON.stringify(head_two)) {
            return this.finish(1);
        }
        
        // Permet de vérifier si nos serpents sont dans le canvas.
        if(!isInside(head_one)) {
            return this.finish(0);
        }

        if(!isInside(head_two)) {
            return this.finish(1);
        }

        // En cas de colission, le jeu s'arrête
        var c = collisions([snake_one, snake_two], [head_one, head_two]);

        if(c.colission) {
            return this.finish(c.snake); 
        }
        
        // Permet de faire avancer notre serpent (on ajoute sa tête)
        snake_one.unshift(head_one);
        snake_two.unshift(head_two);

        this.setState({ 
            snake_one: snake_one,
            snake_two: snake_two,
            score: score,
            keypressed_snake_one: keypressed_snake_one,
            keypressed_snake_two: keypressed_snake_two
        });

        clearCanvas();
        renderSnake(snake_one, styles.blue);
        renderSnake(snake_two, styles.pink);
    }

    render() {
        let { snake_one_score, snake_two_score, snake_one_name, snake_two_name, snake_one_color, snake_two_color } = this.state;
        return (
            <div className="game">
                <h1 className="title">Serpentron</h1>
                <Canvas />
                <div className="scores">
                    <Score color={snake_one_color} text={snake_one_name} value={snake_one_score} keyboard="&#8593;&#8595;&#8592;&#8594;"></Score>
                    <Score color={snake_two_color} text={snake_two_name} value={snake_two_score} keyboard="zsqd"></Score>
                </div>
            </div>
        );
    }
} 