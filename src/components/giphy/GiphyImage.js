import React, { useState, useEffect } from 'react';

const GiphyImage = ({ url }) => {

    const [imageLoaded, setImageLoaded] = useState(false);

    useEffect(() => {


        setImageLoaded(false); // Đặt biến state để kiểm tra xem hình ảnh đã tải xong hay chưa

        const img = new Image();
        img.src = url;
        img.onload = () => {
            setImageLoaded(true); // Đặt biến state để báo hiệu rằng hình ảnh đã tải xong

        };
    }, [url]);




    return (



        <>
            {imageLoaded ? (
                <div style={{ width: '100%', position: 'relative' }}>
                    <img
                        style={{ width: '100%', height: '100%' }}
                        src={url}
                        alt=""
                    />
                </div>
            ) : <p style={{ textAlign: "center" }}>...</p>
            }</>


    );
}

export default GiphyImage;
