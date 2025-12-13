
import React, { useCallback, useEffect } from 'react';

import './Keyboard.css';
import { fromEvent } from 'rxjs';

export default function Keyboard({
}: Readonly<{}>) {

    const [key, setKey] = React.useState<string>('__none__');

    const defClasses = ['keyboard__btn'];

    const makeActiveClass = useCallback((keyName: string) => {
        return [...defClasses, key === keyName ? 'keyboard__btn--active' : ''].join(' ');
    }, [key]);

    useEffect(() => {
    
    const subscription = fromEvent<KeyboardEvent>(window, 'keydown').subscribe(event => {
      console.log(`Key pressed: ${event.key}`);
      setKey(event.key);
    });

    return () => {
      subscription.unsubscribe();
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
                <div className={makeActiveClass('')}><span >`</span></div>
                <div className={makeActiveClass('')}><span >1</span></div>
                <div className={makeActiveClass('')}><span >2</span></div>
                <div className={makeActiveClass('')}><span >3</span></div>
                <div className={makeActiveClass('')}><span >4</span></div>
                <div className={makeActiveClass('')}><span >5</span></div>
                <div className={makeActiveClass('')}><span >6</span></div>
                <div className={makeActiveClass('')}><span >7</span></div>
                <div className={makeActiveClass('')}><span >8</span></div>
                <div className={makeActiveClass('')}><span >9</span></div>
                <div className={makeActiveClass('')}><span >0</span></div>
                <div className={makeActiveClass('')}><span >-</span></div>
                <div className={makeActiveClass('')}><span >=</span></div>
                <div className="keyboard__btn keyboard_btn--double"><span >backspace</span></div>
                <div className={makeActiveClass('')}><span >insert</span></div>
                <div className={makeActiveClass('')}><span >home</span></div>
                <div className={makeActiveClass('')}><span >Page up</span></div>
                <div className={makeActiveClass('')}><span >num lock</span></div>
                <div className={makeActiveClass('')}><span >/</span></div>
                <div className={makeActiveClass('')}><span >*</span></div>
                <div className={makeActiveClass('')}><span >-</span></div>
            </div>
            {/* 2 row end */}
            <div className="keyboard-row flex flex-1 flex-nowrap flex-row justify-between">
                <div className={makeActiveClass('')}><span >tab</span></div>
                <div className={makeActiveClass('')}><span >q</span></div>
                <div className={makeActiveClass('')}><span >w</span></div>
                <div className={makeActiveClass('')}><span >e</span></div>
                <div className={makeActiveClass('')}><span >r</span></div>
                <div className={makeActiveClass('')}><span >t</span></div>
                <div className={makeActiveClass('')}><span >y</span></div>
                <div className={makeActiveClass('')}><span >u</span></div>
                <div className={makeActiveClass('')}><span >i</span></div>
                <div className={makeActiveClass('')}><span >o</span></div>
                <div className={makeActiveClass('')}><span >p</span></div>
                <div className={makeActiveClass('')}><span >[</span></div>
                <div className={makeActiveClass('')}><span >]</span></div>
                <div className={makeActiveClass('')}><span >enter</span></div>
                <div className={makeActiveClass('')}><span >del</span></div>
                <div className={makeActiveClass('')}><span >end</span></div>
                <div className={makeActiveClass('')}><span >page down</span></div>
                <div className={makeActiveClass('')}><span >7</span></div>
                <div className={makeActiveClass('')}><span >8</span></div>
                <div className={makeActiveClass('')}><span >9</span></div>
                <div className={makeActiveClass('')}><span >+</span></div>
            </div>
            <div className="keyboard-row flex flex-1 flex-nowrap flex-row justify-between">
                <div className={makeActiveClass('')}><span >caps</span></div>
                <div className={makeActiveClass('')}><span >a</span></div>
                <div className={makeActiveClass('')}><span >s</span></div>
                <div className={makeActiveClass('')}><span >d</span></div>
                <div className={makeActiveClass('')}><span >f</span></div>
                <div className={makeActiveClass('')}><span >g</span></div>
                <div className={makeActiveClass('')}><span >h</span></div>
                <div className={makeActiveClass('')}><span >j</span></div>
                <div className={makeActiveClass('')}><span >k</span></div>
                <div className={makeActiveClass('')}><span >l</span></div>
                <div className={makeActiveClass('')}><span >;</span></div>
                <div className={makeActiveClass('')}><span >&apos;</span></div>
                <div className={makeActiveClass('')}><span >\</span></div>
                <div className={makeActiveClass('')}><span ></span></div>
                <div className={makeActiveClass('')}><span ></span></div>
                <div className={makeActiveClass('')}><span ></span></div>
                <div className={makeActiveClass('')}><span ></span></div>
                <div className={makeActiveClass('')}><span >4</span></div>
                <div className={makeActiveClass('')}><span >5</span></div>
                <div className={makeActiveClass('')}><span >6</span></div>
                <div className={makeActiveClass('')}><span ></span></div>
            </div>
            <div className="keyboard-row flex flex-1 flex-nowrap flex-row justify-between">
                <div className={makeActiveClass('')}><span >lshift</span></div>
                <div className={makeActiveClass('')}><span >\</span></div>
                <div className={makeActiveClass('')}><span >z</span></div>
                <div className={makeActiveClass('')}><span >x</span></div>
                <div className={makeActiveClass('')}><span >c</span></div>
                <div className={makeActiveClass('')}><span >v</span></div>
                <div className={makeActiveClass('')}><span >b</span></div>
                <div className={makeActiveClass('')}><span >n</span></div>
                <div className={makeActiveClass('')}><span >m</span></div>
                <div className={makeActiveClass('')}><span >,</span></div>
                <div className={makeActiveClass('')}><span >.</span></div>
                <div className={makeActiveClass('')}><span >/</span></div>
                <div className={makeActiveClass('')}><span >rshift</span></div>
                <div className={makeActiveClass('')}><span ></span></div>
                <div className={makeActiveClass('')}><span ></span></div>
                <div className={makeActiveClass('')}><span >aup</span></div>
                <div className={makeActiveClass('')}><span ></span></div>
                <div className={makeActiveClass('')}><span >1</span></div>
                <div className={makeActiveClass('')}><span >2</span></div>
                <div className={makeActiveClass('')}><span >3</span></div>
                <div className={makeActiveClass('')}><span >enter</span></div>
            </div>
            <div className="keyboard-row flex flex-1 flex-nowrap flex-row justify-between">
                <div className={makeActiveClass('')}><span >lctrl</span></div>
                <div className={makeActiveClass('')}><span >lwin</span></div>
                <div className={makeActiveClass('')}><span >ralt</span></div>
                <div className={makeActiveClass('')}><span >space</span></div>
                <div className={makeActiveClass('')}><span ></span></div>
                <div className={makeActiveClass('')}><span ></span></div>
                <div className={makeActiveClass('')}><span ></span></div>
                <div className={makeActiveClass('')}><span ></span></div>
                <div className={makeActiveClass('')}><span ></span></div>
                <div className={makeActiveClass('')}><span ></span></div>
                <div className={makeActiveClass('')}><span >ralt</span></div>
                <div className={makeActiveClass('')}><span >rwin</span></div>
                <div className={makeActiveClass('')}><span >cmenu</span></div>
                <div className={makeActiveClass('')}><span >rctrl</span></div>
                <div className={makeActiveClass('')}><span >aleft</span></div>
                <div className={makeActiveClass('')}><span >adown</span></div>
                <div className={makeActiveClass('')}><span >aright</span></div>
                <div className={makeActiveClass('')}><span >0</span></div>
                <div className={makeActiveClass('')}><span ></span></div>
                <div className={makeActiveClass('')}><span >.</span></div>
                <div className={makeActiveClass('')}><span ></span></div>
            </div>
        </div>
    );
}
