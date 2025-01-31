import React from 'react';
import ReactDOM from "react-dom";
import { ReactComponent } from '@aot-technologies/formio-react';
import { Components } from 'formiojs';
import PrintServices from '../print/printService';
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

  static editForm = settingsForm;

  attachReact(element) {
    
    const printServices = new PrintServices();
  
    if (!printServices || typeof printServices.renderSVGForm !== 'function') {
      throw new Error('printServices.renderSVGForm is not available.');
    }

    const isEditMode = this.isPreviewPanelVisible();    

    const svgComponents = printServices.renderSVGForm(this.data, this.component, isEditMode, this.builderMode);

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

  isPreviewPanelVisible(){
    const previewPanel = document.querySelector('.card.panel.preview-panel');
    if (previewPanel) {
      const isVisible = previewPanel.offsetHeight > 0 && previewPanel.offsetWidth > 0;      
      if (isVisible) {
        console.log('Preview panel is visible!');
      } else {
        console.log('Preview panel is not visible.');
      }
      return isVisible;
    } else {
      console.log('Preview panel not found.');
      return false;
    }
  }
}

