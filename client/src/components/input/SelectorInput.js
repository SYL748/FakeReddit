import './input.css'
export default function SelectInput({ label, options, value, onChange, id, error, disabled=false }) {
    return (
        <div className="input-group">
            <label htmlFor={id}>{label}:</label>
            <select id={id} value={value} onChange={onChange} required disabled={disabled}>
                <option value="">-- Select --</option> {/* This is the empty option */}
                {options.map((option, index) => (
                    <option key={`${option.value}${index}`} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && <p className="error-message">{error}</p>}
        </div>
    );
}
