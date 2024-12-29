
import "./spinner.css";

const Spinner = () => {
  return (
    <div className="car-loading-container">
      <div className="road">
        <div className="car">
          <div className="body"></div>
          <div className="wheel front"></div>
          <div className="wheel back"></div>
        </div>
      </div>
    </div>
  );
};

export default Spinner;
