import './button.css'

function Button(props) {
    return (
        <button
            className={props.className}
            onClick={props.onClick}
        >
            {props.buttonName}
        </button>
    );
}

export default Button;