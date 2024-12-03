import './input.css'

export default function TextAreaInput({ label, value, onChange, id, error, maxLength = Infinity }) {
    return (
        <div className="input-group">
            <label htmlFor={id}>{label}:</label>
            <textarea
                id={id}
                value={value}
                onChange={onChange}
                required
                {...(maxLength !== Infinity && { maxLength })}
            ></textarea>
            {error && <p className="error-message">{error}</p>}
            {maxLength !== Infinity && (
                <p className="char-limit">{`${value.length}/${maxLength} characters used`}</p>
            )}
        </div>
    );
}
