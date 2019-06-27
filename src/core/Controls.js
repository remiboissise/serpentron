export function keyboardSnake(up, down, left, right) {
    return {
        key_up: up,
        key_down: down,
        key_left: left,
        key_right: right
    }
}

export const CONTROLS = {
    UP : { x : 0, y : -1, key : 'UP' },
    DOWN : { x : 0, y : 1, key : 'DOWN' },
    LEFT : { x : -1, y : 0, key: 'LEFT' },
    RIGHT : { x : 1, y : 0, key: 'RIGHT' } 
};

export function handleKeyboard(event, keys) {
    switch(event.key){
        case keys.key_up: return CONTROLS.UP;
        case keys.key_down: return CONTROLS.DOWN;
        case keys.key_left: return CONTROLS.LEFT;
        case keys.key_right: return CONTROLS.RIGHT;
        default: return;
    } 
}

export function isNotOpposite(newkey, keypressed) {
    if((keypressed.key === 'RIGHT' && newkey.key === 'LEFT') 
        || (keypressed.key === 'UP' && newkey.key === 'DOWN') 
        || (keypressed.key === 'LEFT' && newkey.key === 'RIGHT') 
        || (keypressed.key === 'DOWN' && newkey.key === 'UP')) {
            return false;
        } 
    return true;
}