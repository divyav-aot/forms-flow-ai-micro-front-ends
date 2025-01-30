import React from 'react';
import ReactDOM from "react-dom";
import { ReactComponent } from '@aot-technologies/formio-react';
import { Components } from 'formiojs';
import PrintServices from './printService';
import settingsForm from "./RSBCImage.settingsForm";

export default class RSBCImage extends ReactComponent {
  static get builderInfo() {
    return {
      title: 'RSBC Image',
      group: 'basic',
      icon: 'image',
      documentation: "",//TODO
      weight: 70,
      schema: RSBCImage.schema(),
    };
  }  

  static schema() {
    return ReactComponent.schema({
      type: 'rsbcimage',
      label: 'RSBC Image',
      key: 'rsbcImage',
    });
  }

  //static editForm = settingsForm;

  attachReact(element) {
    // Check if we're in builder mode
    const printServices = new PrintServices();
  
    // Ensure the printServices and renderSVGForm method are available
    if (!printServices || typeof printServices.renderSVGForm !== 'function') {
      throw new Error('printServices.renderSVGForm is not available.');
    }

    // Get the array of <SVGPrint> components
    const svgComponents = printServices.renderSVGForm("", "");

    // Map over the array and render each SVGPrint component inside a div
    return ReactDOM.render(
      <div className="rsbc-image-container">
        {svgComponents.map((svg, index) => (
          <div key={index} className="rsbc-image">
            {svg}
          </div>
        ))}
      </div>,
      element
    );
    
  }  

  detachReact(element) {
    if (element) {
      ReactDOM.unmountComponentAtNode(element);
    }
  }
}



// Register the custom component in Form.io
Components.addComponent('rsbcimage', RSBCImage);
