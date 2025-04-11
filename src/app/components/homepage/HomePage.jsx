import Achievement from "./Achievement";
import Banner from "./Banner";
import CoursePlatform from "./CoursePlatform";
import Headline from "./Headline";
import HeroSection from "./HeroSection";
import PopularInsights from "./PopularInsights";
import Review from "./Review";
import StatsSection from "./StatsSection";
import StudentSuccessStories from "./StudentSuccessStories";
import TestimonialSection from "./TestimonialSection";

const HomePage = () => {
  return (
    <div>
      <div>
        <Banner />
        <Headline />
        <HeroSection />
        <CoursePlatform></CoursePlatform>
        <Review />
        <PopularInsights></PopularInsights>
        {/* <StatsSection /> */}
        <StudentSuccessStories></StudentSuccessStories>
        <Achievement />
        <TestimonialSection></TestimonialSection>
      </div>
    </div>
  );
};

export default HomePage;
