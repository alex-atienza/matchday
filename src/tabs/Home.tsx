import HomeHero from "./HomeHero";
import HomeFeed from "./HomeFeed";

export default function Home() {
  return (
    <div className="screen">
      <div className="scroll">
        <HomeHero />
        <HomeFeed />
      </div>
    </div>
  );
}
