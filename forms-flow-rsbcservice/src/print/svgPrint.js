import React from "react";
import { printFormatHelper, printCheckHelper } from "./helpers";
import formFieldLayout from "./print_layout.json";
import "./svgPrint.scss";
export const SVGprint = ({
  form,
  formAspect,
  formLayout,
  formType,
  values,
  impoundLotOperators,
  renderStage,
  isPreview, 
}) => {
  const formFields = formFieldLayout[formLayout][formType];
  const allFormFields = formFieldLayout[formLayout]["fields"];
  const viewBox = formFieldLayout[formLayout]["viewbox"];

  var svgStyle = {};  

  if (Object.keys(values).length) {
    if (renderStage === "stageTwo") {
      if (formLayout === "TwelveHour") {
        svgStyle = { marginTop: "28px" };
      } else if (formLayout === "TwentyFourHour") {
        svgStyle = { marginLeft: "0px", marginRight: "0px", marginTop: "28px", marginBottom: "0px" };
      } else if (formLayout === "VI") {        
        svgStyle = isPreview
          ? { marginLeft: "0px", marginRight: "0px", marginTop: "50px", marginBottom: "40px" } // Submission Mode
          : { marginLeft: "-430px", marginRight: "-280px", marginTop: "50px", marginBottom: "40px" } ;// Preview Mode
      }
    }

    return (
      <div style={svgStyle}>
        <svg viewBox={viewBox} xmlns="http://www.w3.org/2000/svg" className={"svg-wrapper" + formAspect}>
          <image href={form} width="223" height="202" />
          {formFields?.map((item) => {
            const fieldKey = item;
            if (allFormFields[item]["field_type"] === "text") {
              return (
                <text key={fieldKey} id={item} x={allFormFields[item]["start"]["x"] + "px"} y={allFormFields[item]["start"]["y"] + "px"} className={allFormFields[item]["classNames"]} fill="black">
                  {printFormatHelper(values, allFormFields[item], item, impoundLotOperators)}
                </text>
              );
            } else if (allFormFields[item]["field_type"] === "checkbox") {
              return (
                <text key={fieldKey} id={item} x={allFormFields[item]["start"]["x"]} y={allFormFields[item]["start"]["y"]} className={allFormFields[item]["classNames"]}>
                  {printCheckHelper(values, allFormFields[item], item) ? "X" : null}
                </text>
              );
            } else if (allFormFields[item]["field_type"] === "always") {
              return (
                <text key={fieldKey} id={item} x={allFormFields[item]["start"]["x"]} y={allFormFields[item]["start"]["y"]} className={allFormFields[item]["classNames"]}>
                  {allFormFields[item]["field_value"]}
                </text>
              );
            } else if (allFormFields[item]["field_type"] === "textArea") {
              return (
                <foreignObject key={fieldKey} id={item} x={allFormFields[item]["start"]["x"] + "px"} y={allFormFields[item]["start"]["y"] + "px"} className={allFormFields[item]["classNames"]} fill="black">
                  {printFormatHelper(values, allFormFields[item], item, impoundLotOperators)}
                </foreignObject>
              );
            }
            return null;
          })}
        </svg>
      </div>
    );
  }
  return <div />;
};
