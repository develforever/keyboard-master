import { useCallback, useEffect, useState } from "react";
import { useAppContext } from "@/app/context";
import clsx from "clsx";
import './ToTranscribe.css';

export default function ToTranscribe() {

    const appContext = useAppContext();
    const [data, setData] = useState<string | null>(null);

    const cssClasses = [
        'to-transcribe border border-dashed border-gray-400 flex items-center justify-center mb-8 p-4',
        appContext.isReady ? 'to-transcribe--ready' : 'to-transcribe--loading',
    ];

    const getData = useCallback(() => {
        return fetch('https://lorem-api.com/api/lorem?paragraphs=2')
            .then(response => response.text())
    }, []);

    useEffect(() => {
        getData().then(data => {
            if (data) {
                setData(data);
                appContext.setIsReady(true);
            }
        });
    }, []);

    return (
        <div className={clsx(cssClasses)}>
            {appContext.isReady && <span className="text-gray-500" style={{ whiteSpace: 'pre-wrap' }}>{data}</span>}
            {!appContext.isReady && <span className="text-gray-500">Loading...</span>}
        </div>
    );
}