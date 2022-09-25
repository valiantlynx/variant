import React from "react";
function Sidebar(props) {
    console.log(props.topAnime);
    return (
        <aside>
            <nav>
                <h3>Top Anime</h3>
                {props.topAnime.map(anime => (
                    <a href={anime.url}
                        target="_blank"
                        rel="noRefferer"
                        key={anime.mal_id}
                    >{anime.title_english}</a>
                ))}
            </nav>
        </aside>
    );
}

export default Sidebar;