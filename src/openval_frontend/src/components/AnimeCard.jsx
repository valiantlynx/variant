import React from "react";


function AnimeCard(props) {
  return (
    <article className="anime-card">
        <a 
            href={props.anime.url} 
            className="anime-card-a-tag" 
            target="_blank" 
            rel="norefferer">
            <figure>
                <img src={props.anime.images.webp.image_url} alt={props.anime.title} />
            </figure>
            <h3>{props.anime.title}</h3>
        </a>

    </article>
  );
}

export default AnimeCard;
