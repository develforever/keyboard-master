import { useCallback, useEffect, useState } from "react";


export default function ToTranscribe() {

    
    const [data, setData] = useState('Loading...');

    const getData = useCallback(() => {
        return fetch('https://lorem-api.com/api/lorem?paragraphs=2')
            .then(response => response.text())
    }, []);

    useEffect(() => {
        getData().then(data => {
            setData(data);
        });
    }, []);

    return (
        <div className="to-transcribe border border-dashed border-gray-400 flex items-center justify-center mb-8 p-4">
            <span className="text-gray-500" style={{ whiteSpace: 'pre-wrap' }}>{data}</span>
        </div>
    );
}