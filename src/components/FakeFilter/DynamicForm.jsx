"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { generateUUID, getLowerFirst, getSnakeCase } from "../../util/Helper";
import {
  CheckIcon,
  Copy,
  CpuIcon,
  PlusIcon,
  Trash2Icon,
  XIcon
} from "lucide-react";

export const DynamicForm = () => {
  const t = useTranslations("FakeFilter");

  const [recipientFields, setRecipientFields] = useState([
    { field: "", type: "string" }
  ]);
  const [certificateFields, setCertificateFields] = useState([
    { field: "institution", type: "string" },
    { field: "institutionKm", type: "string" }
  ]);
  const [generatedSchema, setGeneratedSchema] = useState(null);
  const [sampleData, setSampleData] = useState(null);
  const [cases, setCases] = useState("camelCase");
  const [copiedButton, setCopiedButton] = useState("");
  const isAnyCopied = copiedButton !== "";
  const [institution, setInstitution] = useState({
    en: "",
    km: ""
  });

  const addRecipientField = () => {
    setRecipientFields([...recipientFields, { field: "", type: "string" }]);
  };

  const removeRecipientField = (index) => {
    setRecipientFields(recipientFields.filter((_, i) => i !== index));
  };

  const addCertificateField = () => {
    setCertificateFields([...certificateFields, { field: "", type: "string" }]);
  };

  const removeCertificateField = (index) => {
    setCertificateFields(certificateFields.filter((_, i) => i !== index));
  };

  const generateSampleValue = (fieldName, type, uuid) => {
    if (fieldName.toLowerCase() === "id") {
      return uuid;
    }
    if (fieldName.toLowerCase() === "institution") {
      return institution.en;
    }
    if (fieldName === "institutionKm" || fieldName === "institution_km") {
      return institution.km;
    }
    switch (type) {
      case "string":
        return "Sample Text";
      default:
        return null;
    }
  };

  const getFieldKey = (field) =>
    cases === "snake_case"
      ? getSnakeCase(field.trim())
      : getLowerFirst(field.trim());

  const handleGenerate = () => {
    const uuid = generateUUID();
    const sample = {
      id: uuid,
      recipient: {},
      certificate: {}
    };

    const schema = {
      type: "object",
      required: ["id", "recipient", "certificate"],
      properties: {
        id: { type: "string" },
        recipient: {
          type: "object",
          required: recipientFields
            .map((f) => getFieldKey(f.field))
            .filter(Boolean),
          properties: {}
        },
        certificate: {
          type: "object",
          required: certificateFields
            .map((f) => getFieldKey(f.field))
            .filter(Boolean),
          properties: {}
        }
      }
    };

    recipientFields.forEach((f) => {
      if (!f.field) return;

      const key = getFieldKey(f.field);

      schema.properties.recipient.properties[key] = {
        type: "string"
      };
    });

    certificateFields.forEach((f) => {
      if (!f.field) return;

      const key = getFieldKey(f.field);
      const lower = f.field.toLowerCase();

      if (lower === "institution") {
        schema.properties.certificate.properties[key] = {
          type: "string",
          enum: [institution.en]
        };
        return;
      }

      if (lower === "institutionkm") {
        schema.properties.certificate.properties[key] = {
          type: "string",
          enum: [institution.km]
        };
        return;
      }

      schema.properties.certificate.properties[key] = {
        type: "string"
      };
    });

    setGeneratedSchema(schema);

    recipientFields.forEach((f) => {
      if (!f.field) return;

      const key = getFieldKey(f.field);

      sample.recipient[key] = String(
        generateSampleValue(f.field, f.type, uuid)
      );
    });

    certificateFields.forEach((f) => {
      if (!f.field) return;

      const key = getFieldKey(f.field);

      sample.certificate[key] = String(
        generateSampleValue(f.field, f.type, uuid)
      );
    });

    setSampleData(sample);
    setCopiedButton("");
  };

  const hasEmptyFields =
    recipientFields.some((f) => !f.field.trim()) ||
    certificateFields.some((f) => !f.field.trim());

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(JSON.stringify(text, null, 2)).then(() => {
      setCopiedButton(key);
      setTimeout(() => setCopiedButton(""), 1500);
    });
  };

  const BrandCopyButton = ({ id, disabled, copiedButton, onClick }) => (
    <button disabled={disabled} onClick={onClick} className={btnBrand}>
      {copiedButton === id ? (
        <CheckIcon className="size-3" />
      ) : (
        <Copy className="size-3" />
      )}
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Recipient Section */}
      <section
        className="p-6 shadow-sm border border-black/10 dark:border-white/10
      bg-white dark:bg-[#060709] rounded-lg"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg">{t("recipientTitle")}</h2>
          <button onClick={addRecipientField} className={btnSecondary}>
            <PlusIcon className="size-3" />
          </button>
        </div>
        {recipientFields.map((field, index) => (
          <div key={index} className="flex gap-3 items-center mb-2">
            <input
              type="text"
              placeholder="Field name"
              value={field.field}
              onChange={(e) => {
                const updated = [...recipientFields];
                updated[index].field = e.target.value.trim();
                setRecipientFields(updated);
              }}
              className="flex-1 px-2 py-1 border rounded border-black/10 dark:border-white/10 bg-white dark:bg-[#060709]"
            />
            <button
              onClick={() => removeRecipientField(index)}
              className={btnBrand}
            >
              <XIcon className="size-3" />
            </button>
          </div>
        ))}
      </section>

      {/* Certificate Section */}
      <section
        className="p-6 shadow-sm border border-black/10 dark:border-white/10
      bg-white dark:bg-[#060709] rounded-lg"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg ">{t("certificateTitle")}</h2>
          <button onClick={addCertificateField} className={btnSecondary}>
            <PlusIcon className="size-3" />
          </button>
        </div>
        {certificateFields.map((field, index) => (
          <div key={index} className="flex gap-3 items-center mb-2">
            <input
              type="text"
              placeholder="Field name"
              value={field.field}
              onChange={(e) => {
                const updated = [...certificateFields];
                updated[index].field = e.target.value.trim();
                setCertificateFields(updated);
              }}
              className="flex-1 px-2 py-1 border rounded border-black/10 dark:border-white/10 bg-white dark:bg-[#060709]"
            />

            {field.field == "institution" && (
              <input
                type="text"
                placeholder="value"
                value={institution.en}
                onChange={(e) =>
                  setInstitution((prev) => ({
                    ...prev,
                    en: e.target.value.replace(/ /g, "")
                  }))
                }
                className="flex-1 px-2 py-1 border rounded border-black/10 dark:border-white/10 bg-white dark:bg-[#060709]"
              />
            )}
            {field.field == "institutionKm" && (
              <input
                type="text"
                placeholder="value"
                value={institution.km}
                onChange={(e) =>
                  setInstitution((prev) => ({
                    ...prev,
                    km: e.target.value
                  }))
                }
                className="flex-1 px-2 py-1 border rounded border-black/10 dark:border-white/10 bg-white dark:bg-[#060709] font-kantumruy"
              />
            )}
            <button
              onClick={() => removeCertificateField(index)}
              className={btnBrand}
            >
              <XIcon className="size-3" />
            </button>
          </div>
        ))}
      </section>

      {/* Buttons Row */}
      <div className="flex gap-3 justify-between">
        <div className="relative inline-flex bg-gray-200 dark:bg-white/10 rounded-full p-1">
          {/* Sliding indicator */}
          <span
            className={`
      absolute top-1 bottom-1 w-1/2 rounded-full
      bg-white dark:bg-[#060709]
      shadow-sm
      transition-all duration-300 ease-out
      ${cases === "snake_case" ? "left-1" : "left-[48%]"}
    `}
          />

          <button
            onClick={() => setCases("snake_case")}
            className={`
      relative z-10 px-3 py-1 text-sm rounded-full
      transition-colors duration-200
      ${cases === "snake_case" ? "text-black dark:text-white" : "text-gray-500"}
    `}
          >
            snake_case
          </button>

          <button
            onClick={() => setCases("camelCase")}
            className={`
      relative z-10 px-4 py-1 text-sm rounded-full
      transition-colors duration-200
      ${cases === "camelCase" ? "text-black dark:text-white" : "text-gray-500"}
    `}
          >
            camelCase
          </button>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleGenerate}
            disabled={hasEmptyFields}
            className={btnSuccess}
          >
            <CpuIcon className="size-3" />
          </button>

          <button
            onClick={() => {
              setRecipientFields([{ field: "", type: "string" }]);
              setCertificateFields([
                { field: "institution", type: "string" },
                { field: "institutionKm", type: "string" }
              ]);
              setGeneratedSchema(null);
              setSampleData(null);
              setCopiedButton("");
            }}
            className={btnDanger}
          >
            <Trash2Icon className="size-3" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-[1fr,1fr] gap-4">
        {/* Output */}
        {generatedSchema && (
          <div className="group p-4 rounded text-sm font-mono overflow-x-auto border border-black/10 dark:border-white/10 bg-white dark:bg-[#060709] dark:hover:border-[#f5dc50]/40">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">{t("generatedSchema")}:</h3>

              <div
                className="
        opacity-0 translate-y-1 scale-95
        group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100
        transition-all duration-200 ease-out
        pointer-events-none group-hover:pointer-events-auto
      "
              >
                <BrandCopyButton
                  id="schema"
                  copiedButton={copiedButton}
                  disabled={isAnyCopied && copiedButton !== "schema"}
                  onClick={() => handleCopy(generatedSchema, "schema")}
                />
              </div>
            </div>

            <pre>{JSON.stringify(generatedSchema, null, 2)}</pre>
          </div>
        )}

        {sampleData && (
          <div className="group p-4 rounded text-sm font-mono overflow-x-auto border border-black/10 dark:border-white/10 bg-white dark:bg-[#060709] dark:hover:border-[#f5dc50]/40">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">{t("sampleData")}:</h3>

              <div
                className="
        opacity-0 translate-y-1 scale-95
        group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100
        transition-all duration-200 ease-out
        pointer-events-none group-hover:pointer-events-auto
      "
              >
                <BrandCopyButton
                  id="sample"
                  copiedButton={copiedButton}
                  disabled={isAnyCopied && copiedButton !== "sample"}
                  onClick={() => handleCopy(sampleData, "sample")}
                />
              </div>
            </div>

            <pre>{JSON.stringify(sampleData, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

const btnBase = `
  p-2 rounded-md
  transition-all duration-150 ease-out
  enabled:hover:brightness-90
  enabled:active:scale-95
  focus:outline-none focus:ring-1
  disabled:opacity-50 disabled:cursor-not-allowed
  flex items-center justify-center
`;

const btnBrand = `
  ${btnBase}
  bg-[#f5dc50] text-black
  focus:ring-[#f5dc50]
`;

const btnSecondary = `
  ${btnBase}
  bg-indigo-600 text-white
  focus:ring-indigo-600
`;

const btnSuccess = `
  ${btnBase}
  bg-green-600 text-white
  focus:ring-green-600
`;

const btnDanger = `
  ${btnBase}
  bg-red-600 text-white
  focus:ring-red-600
`;
