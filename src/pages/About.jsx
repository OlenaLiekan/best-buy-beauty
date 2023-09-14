import React from 'react';

const About = () => {
    return (
        <div className="main__about about-main">
            <div className="about-main__container">
                <div className="about-main__content">
                    <h2 className="about-main__title">
                        ALGUNS FATOS SOBRE NÓS
                    </h2>
                    <p className="about-main__text about-main__text-bg">
                        Mais de 5 anos de trabalho.
                    </p>
                    <p className="about-main__text">
                        Centenas de clientes satisfeitos.
                    </p>
                    <p className="about-main__text about-main__text-bg">
                        Vendemos produtos que nós mesmos testamos no trabalho e podemos aconselhar nossos clientes. Assim, você pode ter certeza da qualidade.
                    </p>
                    <p className="about-main__text">
                        Embalagem de mercadorias de alta qualidade com amor para cada cliente.
                    </p>
                    <p className="about-main__text about-main__text-bg">
                        Bons descontos e brindes.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default About;