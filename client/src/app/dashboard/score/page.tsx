import CountChart from "@/components/chart/CountChart";
import OverviewChart from "@/components/chart/OverviewChart";

const ScorePage = () => {
  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      <div className="w-full flex gap-4 flex-col lg:flex-row">
        <div className="w-full lg:w-1/2 h-[450px]">
          <CountChart />
        </div>

        <div className="w-full lg:w-1/2 h-[450px]">
          <OverviewChart />
        </div>
      </div>
    </div>
  );
};

export default ScorePage;
