import { Panel, useReactFlow, getNodesBounds, getViewportForBounds } from 'reactflow';
import { toPng, toJpeg, toSvg } from 'html-to-image';

function downloadImage(dataUrl, name, extension) {
  const a = document.createElement('a');
  a.setAttribute('download', `${name}.${extension}`);
  a.setAttribute('href', dataUrl);
  a.click();
}

function ScreenshotButton({config, onScreenshot }) {
  const { getNodes } = useReactFlow();
  const nodesBounds = getNodesBounds(getNodes());

  const onClick = () => {
    const backgroundColor = config?.backgroundColor ?? '#ffffff';

    let captureConfig;
    if (config?.width !== undefined || config?.height !== undefined || config?.padding !== undefined) {
      const width = config?.width ?? 1024;
      const height = config?.height ?? 768;
      const padding = config?.padding ?? 0;
      const minZoom = config?.minZoom ?? 0.5;
      const maxZoom = config?.maxZoom ?? 2;

      const viewport = getViewportForBounds(nodesBounds, width, height, minZoom, maxZoom, padding);

      captureConfig = {
        backgroundColor: backgroundColor,
        width: width,
        height: height,
        style: {
          width: width,
          height: height,
          transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
        },
      };
    } else {
      captureConfig = {
      backgroundColor: backgroundColor,
      };
    }
    const viewportElement = document.querySelector('.react-flow__viewport');
    const format = config?.format ?? 'png';
    const returnImage = config?.addToState ?? false;
    const name = config?.name ?? 'flow';

    const handleImage = (dataUrl) => {
      if (returnImage) {
        onScreenshot(dataUrl);
      } else {
        downloadImage(dataUrl, name, format);
      }
    };

    switch(format) {
      case 'png':
        toPng(viewportElement, captureConfig).then(handleImage);
        break;
      case 'jpeg':
        toJpeg(viewportElement, captureConfig).then(handleImage);
        break;
      case 'svg':
        toSvg(viewportElement, captureConfig).then(handleImage);
        break;
      default:
        toPng(viewportElement, captureConfig).then(handleImage);
    }
  };

  return (
    <Panel position="top-right">
      <button onClick={onClick} title="screenshot" style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: '20px' }}>
        <i className="bi bi-camera"></i>
      </button>
    </Panel>
  );
}

export default ScreenshotButton;