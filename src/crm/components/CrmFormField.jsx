import React from "react";

function CrmFormField({
  label,
  name,
  value,
  onChange,
  type = "text",
  options,
  required = false,
  placeholder,
  rows = 3,
}) {
  const id = `crm-field-${name}`;

  function handleChange(event) {
    onChange(
      name,
      type === "checkbox" ? event.target.checked : event.target.value,
    );
  }

  if (type === "checkbox") {
    return (
      <label className="crm-form-field crm-form-field--checkbox" htmlFor={id}>
        <input
          checked={Boolean(value)}
          id={id}
          name={name}
          onChange={handleChange}
          type="checkbox"
        />
        <span>
          {label}
          {required ? <b>*</b> : null}
        </span>
      </label>
    );
  }

  return (
    <label className="crm-form-field" htmlFor={id}>
      <span>
        {label}
        {required ? <b>*</b> : null}
      </span>

      {type === "textarea" ? (
        <textarea
          id={id}
          name={name}
          onChange={handleChange}
          placeholder={placeholder}
          rows={rows}
          value={value ?? ""}
        />
      ) : null}

      {type === "select" ? (
        <select
          id={id}
          name={name}
          onChange={handleChange}
          required={required}
          value={value ?? ""}
        >
          {(options ?? []).map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : null}

      {type !== "textarea" && type !== "select" ? (
        <input
          id={id}
          name={name}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
          type={type}
          value={value ?? ""}
        />
      ) : null}
    </label>
  );
}

export default CrmFormField;
