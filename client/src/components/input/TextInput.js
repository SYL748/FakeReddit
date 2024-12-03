import './input.css'

export default function TextInput({ label, value, onChange, id, placeholder, error, maxLength = Infinity }) {
    return (
        <div className="input-group">
            <label htmlFor={id}>{label}:</label>
            <input
                id={id}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required
                {...(maxLength !== Infinity && { maxLength })}
            />
            {error && <p className="error-message">{error}</p>}
            {maxLength !== Infinity && (
                <p className="char-limit">{`${value.length}/${maxLength} characters used`}</p>
            )}
        </div>
    );
}