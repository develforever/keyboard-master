
import React, { useCallback, useEffect } from 'react';

import './Keyboard.css';
import { fromEvent } from 'rxjs';

export default function Keyboard({
}: Readonly<{}>) {

    const [key, setKey] = React.useState<string>('__none__');

    const defClasses = ['keyboard__btn'];

    const makeActiveClass = useCallback((keyCode: string) => {

        return [...defClasses, key.toLocaleLowerCase() === keyCode.toLocaleLowerCase() ? 'keyboard__btn--active' : ''].join(' ');
    }, [key]);

    useEffect(() => {

        const subscriptionDown = fromEvent<KeyboardEvent>(window, 'keydown').subscribe(event => {
            event.preventDefault();
            event.stopPropagation();
            setKey(event.code);
        });

        const subscriptionUp = fromEvent<KeyboardEvent>(window, 'keyup').subscribe(event => {
            event.preventDefault();
            event.stopPropagation();
            setKey('__none__');
        });

        return () => {
            subscriptionDown.unsubscribe();
            subscriptionUp.unsubscribe();
        };
    }, []);

    return (
        <div className="keyboard flex-1 flex flex-col justify-between">
            <div className="keyboard-row flex flex-1 flex-nowrap flex-row justify-between">
                <div className={makeActiveClass('Escape')}><span >ESC</span></div>
                <div className={makeActiveClass('F1')}><span >F1</span></div>
                <div className={makeActiveClass('F2')}><span >F2</span></div>
                <div className={makeActiveClass('F3')}><span >F3</span></div>
                <div className={makeActiveClass('F4')}><span >F4</span></div>
                <div className={makeActiveClass('F5')}><span >F5</span></div>
                <div className={makeActiveClass('F6')}><span >F6</span></div>
                <div className={makeActiveClass('F7')}><span >F7</span></div>
                <div className={makeActiveClass('F8')}><span >F8</span></div>
                <div className={makeActiveClass('F9')}><span >F9</span></div>
                <div className={makeActiveClass('F10')}><span >F10</span></div>
                <div className={makeActiveClass('F11')}><span >F11</span></div>
                <div className={makeActiveClass('F12')}><span >F12</span></div>
                <div className={makeActiveClass('PrintScreen')}><span >print screen</span></div>
                <div className={makeActiveClass('ScrollLock')}><span >scroll lock</span></div>
                <div className={makeActiveClass('Pause')}><span >pause break</span></div>
                <div className={makeActiveClass('')}><span >led</span></div>
                <div className={makeActiveClass('')}><span >led</span></div>
                <div className={makeActiveClass('')}><span >led</span></div>
                <div className="keyboard__btn keyboard__btn--double"><span >logo</span></div>
            </div>
            {/* 2 row */}
            <div className="keyboard-row flex flex-1 flex-nowrap flex-row justify-between">
                <div className={makeActiveClass('Backquote')}><span >`</span></div>
                <div className={makeActiveClass('Digit1')}><span >1</span></div>
                <div className={makeActiveClass('Digit2')}><span >2</span></div>
                <div className={makeActiveClass('Digit3')}><span >3</span></div>
                <div className={makeActiveClass('Digit4')}><span >4</span></div>
                <div className={makeActiveClass('Digit5')}><span >5</span></div>
                <div className={makeActiveClass('Digit6')}><span >6</span></div>
                <div className={makeActiveClass('Digit7')}><span >7</span></div>
                <div className={makeActiveClass('Digit8')}><span >8</span></div>
                <div className={makeActiveClass('Digit9')}><span >9</span></div>
                <div className={makeActiveClass('Digit0')}><span >0</span></div>
                <div className={makeActiveClass('Minus')}><span >-</span></div>
                <div className={makeActiveClass('Equal')}><span >=</span></div>
                <div className={makeActiveClass('Backspace')}><span >backspace</span></div>
                <div className={makeActiveClass('Insert')}><span >insert</span></div>
                <div className={makeActiveClass('Home')}><span >home</span></div>
                <div className={makeActiveClass('PageUp')}><span >Page up</span></div>
                <div className={makeActiveClass('NumLock')}><span >num lock</span></div>
                <div className={makeActiveClass('NumpadDivide')}><span >/</span></div>
                <div className={makeActiveClass('NumpadMultiply')}><span >*</span></div>
                <div className={makeActiveClass('NumpadSubtract')}><span >-</span></div>
            </div>
            {/* 2 row end */}
            <div className="keyboard-row flex flex-1 flex-nowrap flex-row justify-between">
                <div className={makeActiveClass('Tab')}><span >tab</span></div>
                <div className={makeActiveClass('KeyQ')}><span >q</span></div>
                <div className={makeActiveClass('KeyW')}><span >w</span></div>
                <div className={makeActiveClass('KeyE')}><span >e</span></div>
                <div className={makeActiveClass('KeyR')}><span >r</span></div>
                <div className={makeActiveClass('KeyT')}><span >t</span></div>
                <div className={makeActiveClass('KeyY')}><span >y</span></div>
                <div className={makeActiveClass('KeyU')}><span >u</span></div>
                <div className={makeActiveClass('KeyI')}><span >i</span></div>
                <div className={makeActiveClass('KeyO')}><span >o</span></div>
                <div className={makeActiveClass('KeyP')}><span >p</span></div>
                <div className={makeActiveClass('BracketLeft')}><span >[</span></div>
                <div className={makeActiveClass('BracketRight')}><span >]</span></div>
                <div className={makeActiveClass('Enter')}><span >enter</span></div>
                <div className={makeActiveClass('Delete')}><span >del</span></div>
                <div className={makeActiveClass('End')}><span >end</span></div>
                <div className={makeActiveClass('PageDown')}><span >page down</span></div>
                <div className={makeActiveClass('Numpad7')}><span >7</span></div>
                <div className={makeActiveClass('Numpad8')}><span >8</span></div>
                <div className={makeActiveClass('Numpad9')}><span >9</span></div>
                <div className={makeActiveClass('NumpadAdd')}><span >+</span></div>
            </div>
            <div className="keyboard-row flex flex-1 flex-nowrap flex-row justify-between">
                <div className={makeActiveClass('CapsLock')}><span >caps</span></div>
                <div className={makeActiveClass('KeyA')}><span >a</span></div>
                <div className={makeActiveClass('KeyS')}><span >s</span></div>
                <div className={makeActiveClass('KeyD')}><span >d</span></div>
                <div className={makeActiveClass('KeyF')}><span >f</span></div>
                <div className={makeActiveClass('KeyG')}><span >g</span></div>
                <div className={makeActiveClass('KeyH')}><span >h</span></div>
                <div className={makeActiveClass('KeyJ')}><span >j</span></div>
                <div className={makeActiveClass('KeyK')}><span >k</span></div>
                <div className={makeActiveClass('KeyL')}><span >l</span></div>
                <div className={makeActiveClass('Semicolon')}><span >;</span></div>
                <div className={makeActiveClass('Quote')}><span >&apos;</span></div>
                <div className={makeActiveClass('Backslash')}><span >\</span></div>
                <div className={makeActiveClass('')}><span ></span></div>
                <div className={makeActiveClass('')}><span ></span></div>
                <div className={makeActiveClass('')}><span ></span></div>
                <div className={makeActiveClass('')}><span ></span></div>
                <div className={makeActiveClass('Numpad4')}><span >4</span></div>
                <div className={makeActiveClass('Numpad5')}><span >5</span></div>
                <div className={makeActiveClass('Numpad6')}><span >6</span></div>
                <div className={makeActiveClass('')}><span ></span></div>
            </div>
            <div className="keyboard-row flex flex-1 flex-nowrap flex-row justify-between">
                <div className={makeActiveClass('ShiftLeft')}><span >lshift</span></div>
                <div className={makeActiveClass('Backslash')}><span >\</span></div>
                <div className={makeActiveClass('KeyZ')}><span >z</span></div>
                <div className={makeActiveClass('KeyX')}><span >x</span></div>
                <div className={makeActiveClass('KeyC')}><span >c</span></div>
                <div className={makeActiveClass('KeyV')}><span >v</span></div>
                <div className={makeActiveClass('KeyB')}><span >b</span></div>
                <div className={makeActiveClass('KeyN')}><span >n</span></div>
                <div className={makeActiveClass('KeyM')}><span >m</span></div>
                <div className={makeActiveClass('Comma')}><span >,</span></div>
                <div className={makeActiveClass('Period')}><span >.</span></div>
                <div className={makeActiveClass('Slash')}><span >/</span></div>
                <div className={makeActiveClass('ShiftRight')}><span >rshift</span></div>
                <div className={makeActiveClass('')}><span ></span></div>
                <div className={makeActiveClass('')}><span ></span></div>
                <div className={makeActiveClass('ArrowUp')}><span >aup</span></div>
                <div className={makeActiveClass('Numpad1')}><span >1</span></div>
                <div className={makeActiveClass('Numpad2')}><span >2</span></div>
                <div className={makeActiveClass('Numpad3')}><span >3</span></div>
                <div className={makeActiveClass('Enter')}><span >enter</span></div>
            </div>
            <div className="keyboard-row flex flex-1 flex-nowrap flex-row justify-between">
                <div className={makeActiveClass('ControlLeft')}><span >lctrl</span></div>
                <div className={makeActiveClass('MetaLeft')}><span >lwin</span></div>
                <div className={makeActiveClass('AltLeft')}><span >alt</span></div>
                <div className={makeActiveClass('Space')}><span >space</span></div>
                <div className={makeActiveClass('')}><span ></span></div>
                <div className={makeActiveClass('')}><span ></span></div>
                <div className={makeActiveClass('')}><span ></span></div>
                <div className={makeActiveClass('')}><span ></span></div>
                <div className={makeActiveClass('')}><span ></span></div>
                <div className={makeActiveClass('')}><span ></span></div>
                <div className={makeActiveClass('AltRight')}><span >ralt</span></div>
                <div className={makeActiveClass('MetaRight')}><span >rwin</span></div>
                <div className={makeActiveClass('ContextMenu')}><span >cmenu</span></div>
                <div className={makeActiveClass('ControlRight')}><span >rctrl</span></div>
                <div className={makeActiveClass('ArrowLeft')}><span >aleft</span></div>
                <div className={makeActiveClass('ArrowDown')}><span >adown</span></div>
                <div className={makeActiveClass('ArrowRight')}><span >aright</span></div>
                <div className={makeActiveClass('Numpad0')}><span >0</span></div>
                <div className={makeActiveClass('')}><span ></span></div>
                <div className={makeActiveClass('NumpadDecimal')}><span >.</span></div>
                <div className={makeActiveClass('')}><span ></span></div>
            </div>
        </div>
    );
}
