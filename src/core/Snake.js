import { CTX, CANVAS_WIDTH, CANVAS_START_X, CANVAS_HEIGHT, CANVAS_START_Y, centerCanvas, leftCanvas, rightCanvas } from '../components/Canvas';

export const SNAKE_LENGTH = 1;

/**
 * Correspond à la position de départ du serpent
 * @param {String} position 'LEFT' | 'CENTER' | 'RIGHT'
 */
export function generateSnake(position) {
    switch(position) {
        case 'LEFT': return [leftCanvas()];
        case 'CENTER': return [centerCanvas()];
        case 'RIGHT': return [rightCanvas()];
        default: return [centerCanvas()];
    }
}

export function renderSnake(snake, color) {
    for(var i = 0, j = snake.length; i < j; i++) {
        CTX.fillStyle = color;
        CTX.fillRect(snake[i].x, snake[i].y, 10, 10);
        CTX.strokeRect(snake[i].x, snake[i].y, 10, 10);
    }
}

export function isInside(head) {
    if((head.x <= CANVAS_WIDTH + CANVAS_START_X) 
        && (head.x >= CANVAS_START_X) 
        && (head.y >= CANVAS_START_Y)
        && (head.y <= CANVAS_START_Y + CANVAS_HEIGHT)) {
            return true;
        }
    return false;
}

export function collisions(snakes, heads) {
    if(snakes.length !== heads.length) { console.error('Must have the same number between snakes and heads'); return; }
    var allSnakes = snakes[0].concat(snakes[1]);
    for(var i = 0, j = heads.length; i < j; i++) {
        for(var k = 0, l = allSnakes.length; k < l; k++) {
            if(heads[i].x === allSnakes[k].x && heads[i].y === allSnakes[k].y) {
                return { colission: true, snake: i };
            }
        }
    }
    return { colission: false, snake: null };
}