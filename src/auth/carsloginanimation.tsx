export default function TruckLoader() {
  return (
    <>
      <style>{`
        .loop-wrapper {
          margin: 0 auto;
          position: relative;
          display: block;
          width: 600px;
          height: 250px;
          overflow: hidden;
          border-bottom: 3px solid #a855f7;
          color: #a855f7;
        }
        .mountain {
          position: absolute;
          right: -900px;
          bottom: -20px;
          width: 2px;
          height: 2px;
          box-shadow: 
            0 0 0 50px #6d28d9,
            60px 50px 0 70px #6d28d9,
            90px 90px 0 50px #6d28d9,
            250px 250px 0 50px #7c3aed,
            290px 320px 0 50px #7c3aed,
            320px 400px 0 50px #7c3aed;
          transform: rotate(130deg);
          animation: mtn 20s linear infinite;
        }
        .hill {
          position: absolute;
          right: -900px;
          bottom: -50px;
          width: 400px;
          border-radius: 50%;
          height: 20px;
          box-shadow: 
            0 0 0 50px #7c3aed,
            -20px 0 0 20px #7c3aed,
            -90px 0 0 50px #7c3aed,
            250px 0 0 50px #6d28d9,
            290px 0 0 50px #6d28d9,
            620px 0 0 50px #6d28d9;
          animation: hill 4s 2s linear infinite;
        }
        .tree, .tree:nth-child(2), .tree:nth-child(3) {
          position: absolute;
          height: 100px; 
          width: 35px;
          bottom: 0;
          background: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/130015/tree.svg) no-repeat;
          filter: hue-rotate(200deg) saturate(3) brightness(0.6) sepia(1) hue-rotate(240deg);
        }
        .rock {
          margin-top: -17%;
          height: 2%; 
          width: 2%;
          bottom: -2px;
          border-radius: 20px;
          position: absolute;
          background: #c4b5fd;
        }
        .truck, .wheels {
          transition: all ease;
          width: 85px;
          margin-right: -60px;
          bottom: 0px;
          right: 50%;
          position: absolute;
        }
        .truck {
          background: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/130015/truck.svg) no-repeat;
          background-size: contain;
          height: 60px;
          filter: hue-rotate(200deg) saturate(5) brightness(0.7) sepia(1) hue-rotate(240deg);
        }
        .truck:before {
          content: " ";
          position: absolute;
          width: 25px;
          box-shadow:
            -30px 28px 0 1.5px #a855f7,
             -35px 18px 0 1.5px #a855f7;
        }
        .wheels {
          background: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/130015/wheels.svg) no-repeat;
          height: 15px;
          margin-bottom: 0;
          filter: hue-rotate(200deg) saturate(5) brightness(0.5) sepia(1) hue-rotate(240deg);
        }
        .tree   { animation: tree  3s 0.000s linear infinite; }
        .tree:nth-child(2) { animation: tree2 2s 0.150s linear infinite; }
        .tree:nth-child(3) { animation: tree3 8s 0.050s linear infinite; }
        .rock   { animation: rock  4s -0.530s linear infinite; }
        .truck  { animation: truck 4s  0.080s ease   infinite; }
        .wheels { animation: truck 4s  0.001s ease   infinite; }
        .truck:before { animation: wind 1.5s 0.000s ease infinite; }

        @keyframes tree {
          0%   { transform: translate(1350px); }
          100% { transform: translate(-50px);  }
        }
        @keyframes tree2 {
          0%   { transform: translate(650px); }
          100% { transform: translate(-50px); }
        }
        @keyframes tree3 {
          0%   { transform: translate(2750px); }
          100% { transform: translate(-50px);  }
        }
        @keyframes rock {
          0%   { right: -200px;  }
          100% { right: 2000px;  }
        }
        @keyframes truck {
          0%   {}
          6%   { transform: translateY(0px);  }
          7%   { transform: translateY(-6px); }
          9%   { transform: translateY(0px);  }
          10%  { transform: translateY(-1px); }
          11%  { transform: translateY(0px);  }
          100% {}
        }
        @keyframes wind {
          0%   {}
          50%  { transform: translateY(3px); }
          100% {}
        }
        @keyframes mtn {
          100% { transform: translateX(-2000px) rotate(130deg); }
        }
        @keyframes hill {
          100% { transform: translateX(-2000px); }
        }
      `}</style>

      <div className="flex items-center justify-center w-full h-full bg-gray-950">
        <div className="flex flex-col items-center gap-4">

          {/* Truck scene */}
          <div className="loop-wrapper">
            <div className="mountain" />
            <div className="hill" />
            <div className="tree" />
            <div className="tree" />
            <div className="tree" />
            <div className="rock" />
            <div className="truck" />
            <div className="wheels" />
          </div>

          {/* Loading text */}
          <p className="text-sm font-medium text-purple-400 tracking-widest uppercase animate-pulse">
            Loading…
          </p>

        </div>
      </div>
    </>
  );
}