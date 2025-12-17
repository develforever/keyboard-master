
import React, { useCallback, useEffect } from 'react';

import './Keyboard.css';
import { fromEvent } from 'rxjs';

export default function Keyboard({
}: Readonly<{}>) {

    const [key, setKey] = React.useState<string>('__none__');

    const defClasses = ['keyboard__btn'];

    const makeActiveClass = useCallback((keyName: string) => {
        
        return [...defClasses, key.toLocaleLowerCase() === keyName.toLocaleLowerCase() ? 'keyboard__btn--active' : ''].join(' ');
    }, [key]);

    useEffect(() => {
    
    const subscriptionDown = fromEvent<KeyboardEvent>(window, 'keydown').subscribe(event => {
      console.log(`Key pressed: ${event.key}`);
      setKey(event.key);
    });

    const subscriptionUp = fromEvent<KeyboardEvent>(window, 'keyup').subscribe(event => {
      console.log(`Key released: ${event.key}`);
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
                <div className={makeActiveClass('')}><span >print screen</span></div>
                <div className={makeActiveClass('')}><span >scroll lock</span></div>
                <div className={makeActiveClass('')}><span >pause break</span></div>
                <div className={makeActiveClass('')}><span >led</span></div>
                <div className={makeActiveClass('')}><span >led</span></div>
                <div className={makeActiveClass('')}><span >led</span></div>
                <div className="keyboard__btn keyboard__btn--double"><span >logo</span></div>
            </div>
            {/* 2 row */}
            <div className="keyboard-row flex flex-1 flex-nowrap flex-row justify-between">
                <div className={makeActiveClass('`')}><span >`</span></div>
                <div className={makeActiveClass('1')}><span >1</span></div>
                <div className={makeActiveClass('2')}><span >2</span></div>
                <div className={makeActiveClass('3')}><span >3</span></div>
                <div className={makeActiveClass('4')}><span >4</span></div>
                <div className={makeActiveClass('5')}><span >5</span></div>
                <div className={makeActiveClass('6')}><span >6</span></div>
                <div className={makeActiveClass('7')}><span >7</span></div>
                <div className={makeActiveClass('8')}><span >8</span></div>
                <div className={makeActiveClass('9')}><span >9</span></div>
                <div className={makeActiveClass('0')}><span >0</span></div>
                <div className={makeActiveClass('-')}><span >-</span></div>
                <div className={makeActiveClass('=')}><span >=</span></div>
                <div className={makeActiveClass('Backspace')}><span >backspace</span></div>
                <div className={makeActiveClass('Insert')}><span >insert</span></div>
                <div className={makeActiveClass('Home')}><span >home</span></div>
                <div className={makeActiveClass('PageUp')}><span >Page up</span></div>
                <div className={makeActiveClass('NumLock')}><span >num lock</span></div>
                <div className={makeActiveClass('/')}><span >/</span></div>
                <div className={makeActiveClass('*')}><span >*</span></div>
                <div className={makeActiveClass('-')}><span >-</span></div>
            </div>
            {/* 2 row end */}
            <div className="keyboard-row flex flex-1 flex-nowrap flex-row justify-between">
                <div className={makeActiveClass('Tab')}><span >tab</span></div>
                <div className={makeActiveClass('Q')}><span >q</span></div>
                <div className={makeActiveClass('W')}><span >w</span></div>
                <div className={makeActiveClass('E')}><span >e</span></div>
                <div className={makeActiveClass('R')}><span >r</span></div>
                <div className={makeActiveClass('T')}><span >t</span></div>
                <div className={makeActiveClass('Y')}><span >y</span></div>
                <div className={makeActiveClass('U')}><span >u</span></div>
                <div className={makeActiveClass('I')}><span >i</span></div>
                <div className={makeActiveClass('O')}><span >o</span></div>
                <div className={makeActiveClass('P')}><span >p</span></div>
                <div className={makeActiveClass('[')}><span >[</span></div>
                <div className={makeActiveClass(']')}><span >]</span></div>
                <div className={makeActiveClass('Enter')}><span >enter</span></div>
                <div className={makeActiveClass('Delete')}><span >del</span></div>
                <div className={makeActiveClass('End')}><span >end</span></div>
                <div className={makeActiveClass('PageDown')}><span >page down</span></div>
                <div className={makeActiveClass('7')}><span >7</span></div>
                <div className={makeActiveClass('8')}><span >8</span></div>
                <div className={makeActiveClass('9')}><span >9</span></div>
                <div className={makeActiveClass('+')}><span >+</span></div>
            </div>
            <div className="keyboard-row flex flex-1 flex-nowrap flex-row justify-between">
                <div className={makeActiveClass('CapsLock')}><span >caps</span></div>
                <div className={makeActiveClass('A')}><span >a</span></div>
                <div className={makeActiveClass('S')}><span >s</span></div>
                <div className={makeActiveClass('D')}><span >d</span></div>
                <div className={makeActiveClass('F')}><span >f</span></div>
                <div className={makeActiveClass('G')}><span >g</span></div>
                <div className={makeActiveClass('H')}><span >h</span></div>
                <div className={makeActiveClass('J')}><span >j</span></div>
                <div className={makeActiveClass('K')}><span >k</span></div>
                <div className={makeActiveClass('L')}><span >l</span></div>
                <div className={makeActiveClass(';')}><span >;</span></div>
                <div className={makeActiveClass('\'')}><span >&apos;</span></div>
                <div className={makeActiveClass('\\')}><span >\</span></div>
                <div className={makeActiveClass('')}><span ></span></div>
                <div className={makeActiveClass('')}><span ></span></div>
                <div className={makeActiveClass('')}><span ></span></div>
                <div className={makeActiveClass('')}><span ></span></div>
                <div className={makeActiveClass('4')}><span >4</span></div>
                <div className={makeActiveClass('5')}><span >5</span></div>
                <div className={makeActiveClass('6')}><span >6</span></div>
                <div className={makeActiveClass('')}><span ></span></div>
            </div>
            <div className="keyboard-row flex flex-1 flex-nowrap flex-row justify-between">
                <div className={makeActiveClass('Shift')}><span >lshift</span></div>
                <div className={makeActiveClass('\\')}><span >\</span></div>
                <div className={makeActiveClass('Z')}><span >z</span></div>
                <div className={makeActiveClass('X')}><span >x</span></div>
                <div className={makeActiveClass('C')}><span >c</span></div>
                <div className={makeActiveClass('V')}><span >v</span></div>
                <div className={makeActiveClass('B')}><span >b</span></div>
                <div className={makeActiveClass('n')}><span >n</span></div>
                <div className={makeActiveClass('m')}><span >m</span></div>
                <div className={makeActiveClass(',')}><span >,</span></div>
                <div className={makeActiveClass('.')}><span >.</span></div>
                <div className={makeActiveClass('/')}><span >/</span></div>
                <div className={makeActiveClass('Shift')}><span >rshift</span></div>
                <div className={makeActiveClass('')}><span ></span></div>
                <div className={makeActiveClass('')}><span ></span></div>
                <div className={makeActiveClass('ArrowUp')}><span >aup</span></div>
                <div className={makeActiveClass('')}><span ></span></div>
                <div className={makeActiveClass('1')}><span >1</span></div>
                <div className={makeActiveClass('2')}><span >2</span></div>
                <div className={makeActiveClass('3')}><span >3</span></div>
                <div className={makeActiveClass('Enter')}><span >enter</span></div>
            </div>
            <div className="keyboard-row flex flex-1 flex-nowrap flex-row justify-between">
                <div className={makeActiveClass('Control')}><span >lctrl</span></div>
                <div className={makeActiveClass('Meta')}><span >lwin</span></div>
                <div className={makeActiveClass('Alt')}><span >ralt</span></div>
                <div className={makeActiveClass(' ')}><span >space</span></div>
                <div className={makeActiveClass('')}><span ></span></div>
                <div className={makeActiveClass('')}><span ></span></div>
                <div className={makeActiveClass('')}><span ></span></div>
                <div className={makeActiveClass('')}><span ></span></div>
                <div className={makeActiveClass('')}><span ></span></div>
                <div className={makeActiveClass('')}><span ></span></div>
                <div className={makeActiveClass('Alt')}><span >ralt</span></div>
                <div className={makeActiveClass('Meta')}><span >rwin</span></div>
                <div className={makeActiveClass('')}><span >cmenu</span></div>
                <div className={makeActiveClass('Control')}><span >rctrl</span></div>
                <div className={makeActiveClass('ArrowLeft')}><span >aleft</span></div>
                <div className={makeActiveClass('ArrowDown')}><span >adown</span></div>
                <div className={makeActiveClass('ArrowRight')}><span >aright</span></div>
                <div className={makeActiveClass('0')}><span >0</span></div>
                <div className={makeActiveClass('')}><span ></span></div>
                <div className={makeActiveClass('.')}><span >.</span></div>
                <div className={makeActiveClass('')}><span ></span></div>
            </div>
        </div>
    );
}
