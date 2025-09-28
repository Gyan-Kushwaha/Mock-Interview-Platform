import "./index.css";

const Loader = () => {
  return (
    <div className="bg-[#212121] z-40 w-screen h-screen flex justify-center items-center">
      <div className="socket">
        <div className="gel center-gel">
          <div className="hex-brick h1"></div>
          <div className="hex-brick h2"></div>
          <div className="hex-brick h3"></div>
        </div>
        <div className="gel c1 r1">
          <div className="hex-brick h1"></div>
          <div className="hex-brick h2"></div>
          <div className="hex-brick h3"></div>
        </div>
        {/* ... shortened for brevity, include all the 'gel' divs from your original file ... */}
        <div className="gel c37 r3">
          <div className="hex-brick h1"></div>
          <div className="hex-brick h2"></div>
          <div className="hex-brick h3"></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;