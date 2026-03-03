import HeroSection from "@/components/root/Homepage/HeroSection";
import AboutSection from "@/components/root/Homepage/AboutSection";
import ExpertiseSection from "@/components/root/Homepage/ExpertiseSection";
import { getHomepageData } from "@/actions/HomepageActions";

export default async function Home() {
	const data = await getHomepageData();

	// If getHomepageData returns an error object, we'll just use the empty defaults
	const homepageData = ('error' in data) ? null : data;

	return (
		<>
			<HeroSection
				heading={homepageData?.hero?.heading}
				subHeading={homepageData?.hero?.subHeading}
				imgTextHeading={homepageData?.hero?.imgTextHeading}
				imgTextSubHeading={homepageData?.hero?.imgTextSubHeading}
				imageUrl={homepageData?.hero?.imageUrl}
			/>
			<AboutSection
				heading={homepageData?.about?.heading}
				subHeading={homepageData?.about?.subHeading}
				focusOn={homepageData?.about?.focusOn}
			/>
			<ExpertiseSection
				expertiseList={homepageData?.expertise as any}
			/>
		</>
	);
}
