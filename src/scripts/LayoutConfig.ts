

export function layoutConfigToHtml(config: LayoutConfig): string {
    /**
     * Checks if the area is a container or an input and generates HTML accordingly.
     */
    function buildContainerAreaHtml(area: InputContainer | InputArea): string {
        let areaHtml = '';

        // check which config
        if ((area as InputContainer).divider) {
            // treat as container
            const container = area as InputContainer;
            areaHtml += '<div class="area';
            if (container.divider.type === 'vertical') {
                // add vertical class
                areaHtml += ' v-split">';
            } else {
                // add horizontal class
                areaHtml += ' h-split">';
            }
            areaHtml += buildContainerHtml(container);
            areaHtml += '</div>';
        } else {
            // input area
            const inputArea = area as InputArea;
            // treat as input
            areaHtml += buildInputHtml(inputArea);
        }
        return areaHtml;
    }

    function buildContainerHtml(container: InputContainer): string {
        let containerHtml = '';
        containerHtml += buildContainerAreaHtml(container.areaA);
        containerHtml += buildContainerAreaHtml(container.areaB);
        return containerHtml;
    }

    function buildInputHtml(input: InputArea): string {
        let inputHtml = '<div';
        // add classes
        inputHtml += ' class="input v-align"';
        // add props
        inputHtml += ` button-name="${input.name}"`;
        // close
        inputHtml += '>';
        // add text
        inputHtml += input.text;
        // close div
        inputHtml += '</div>';
        return inputHtml;
    }

    let html = '';

    // traverse layout configuration
    // left
    if ((config.left as InputContainer).divider) {
        const container = config.left as InputContainer;
        html += '<div class="left area';
        if (container.divider.type === 'vertical') {
            // add vertical class
            html += ' v-split">';
        } else {
            // horizontal
            html += ' h-split">';
        }
        html += buildContainerHtml(container);
        html += '</div>';
    }
    // center
    if ((config.center as InputContainer).divider) {
        const container = config.center as InputContainer;
        html += '<div class="center area';
        if (container.divider.type === 'vertical') {
            // add vertical class
            html += ' v-split">';
        } else {
            // horizontal
            html += ' h-split">';
        }
        html += buildContainerHtml(container);
        html += '</div>';
    }
    // right
    if ((config.right as InputContainer).divider) {
        const container = config.right as InputContainer;
        html += '<div class="right area';
        if (container.divider.type === 'vertical') {
            // add vertical class
            html += ' v-split">';
        } else {
            // horizontal
            html += ' h-split">';
        }
        html += buildContainerHtml(container);
        html += '</div>';
    }

    return html;
}

/**
 * Gamepad layouts can be configured.
 */
export interface LayoutConfig {
    left: InputContainer | InputArea;
    right: InputContainer | InputArea;
    /**
     * Inputs in the center can be hidden optionally.
     */
    center: InputContainer | InputArea;
}

export interface InputArea {
    type: 'button' | 'pad';
    name: string;
    text: string;
}

/**
 * A container splits a area into two sub areas
 * that can be containers again or inputs.
 */
export interface InputContainer {
    areaA: InputContainer | InputArea;
    areaB: InputContainer | InputArea;
    divider: ContainerDivider;

}

export interface ContainerDivider {
    type: 'vertical' | 'horizontal';
    /**
     * Position of divider in percent.
     */
    initialPosition: number;
}
