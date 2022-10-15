import React from "react";

function Button(props) {
    return(
        <div className="btn btn-dark">
            <button
            type="button"
              onClick={props.handleClick}
              id="title">
              {props.text}
            </button>
            </div>
    )
}

export default Button;