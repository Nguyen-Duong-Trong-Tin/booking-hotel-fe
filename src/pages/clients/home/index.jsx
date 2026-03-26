import { Button, Layout, Typography } from "antd";
import ClientFooter from "../../../components/layout/ClientFooter";
import ClientHeader from "../../../components/layout/ClientHeader";

const { Content } = Layout;
const { Title, Text } = Typography;

const STATS = [
  { label: "Rooms", value: "420+" },
  { label: "Cities", value: "18" },
  { label: "Guests served", value: "120k" },
  { label: "Years of care", value: "12" }
];

const VALUES = [
  {
    title: "People-first hospitality",
    description:
      "We train every host to remember your name, preferences, and purpose of travel."
  },
  {
    title: "Design with soul",
    description:
      "Each property blends local craft with modern comfort, so every stay feels unique."
  },
  {
    title: "Smart, calm stays",
    description:
      "Quiet tech keeps check-ins fast and rooms peaceful, without losing the human touch."
  }
];

const LOCATIONS = [
  {
    name: "Ha Noi",
    description: "Boutique rooms near the Old Quarter with rooftop city views."
  },
  {
    name: "Da Nang",
    description: "Beachfront suites designed for sunrise lovers and late brunches."
  },
  {
    name: "Hoi An",
    description: "Lantern-lit courtyards and heritage villas steps from the river."
  },
  {
    name: "Can Tho",
    description: "Riverfront stays with floating market tours and local cuisine."
  }
];

const TIMELINE = [
  {
    year: "2013",
    title: "First home in Hue",
    description: "A 12-room heritage villa becomes the seed of our story."
  },
  {
    year: "2017",
    title: "Coastal expansion",
    description: "We open our first beach resort and hospitality academy."
  },
  {
    year: "2021",
    title: "Vietnam-wide network",
    description: "Properties across the north, central, and south in one platform."
  },
  {
    year: "2026",
    title: "Smart travel platform",
    description: "AI-assisted planning and curated local experiences for guests."
  }
];

export default function Home() {
  return (
    <Layout className="min-h-screen bg-slate-50 text-slate-900">
      <ClientHeader />
      <Content className="relative overflow-hidden">
        <div className="about-hero absolute inset-0" />
        <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-16">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-6">
              <Text className="tracking-[0.4em] text-xs uppercase text-cyan-700">
                About Booking Hotel
              </Text>
              <Title level={1} className="about-title !mb-0">
                We craft places that feel like home, wherever you land in Viet Nam.
              </Title>
              <Text className="text-base text-slate-600">
                Booking Hotel is a hospitality company with rooms across Viet Nam. We
                combine local character with modern comfort, delivering consistent
                service in every destination. This is a demo project with curated
                sample data.
              </Text>
              <div className="flex flex-wrap gap-3">
                <Button
                  type="primary"
                  size="large"
                  className="rounded-full bg-cyan-600 border-none px-7 font-semibold"
                >
                  Explore our rooms
                </Button>
                <Button
                  size="large"
                  className="rounded-full border border-slate-300 bg-transparent text-slate-700"
                >
                  Contact the team
                </Button>
              </div>
            </div>
            <div className="about-card grid gap-6 rounded-3xl border border-slate-200 bg-white/80 p-6 backdrop-blur">
              <div className="grid grid-cols-2 gap-4">
                {STATS.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="text-2xl font-semibold text-cyan-700">
                      {stat.value}
                    </div>
                    <div className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-cyan-100/70 to-indigo-100/60 p-5">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Our promise
                </div>
                <div className="mt-3 text-sm text-slate-600">
                  Every stay includes curated local guides, 24/7 concierge chat, and
                  a dedicated host on arrival.
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {VALUES.map((value) => (
              <div
                key={value.title}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-cyan-200/40"
              >
                <div className="text-lg font-semibold text-cyan-700">
                  {value.title}
                </div>
                <p className="mt-3 text-sm text-slate-600">{value.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-20 grid gap-10 lg:grid-cols-[1fr_1fr]">
            <div>
              <Text className="text-xs uppercase tracking-[0.3em] text-slate-500">
                Growth story
              </Text>
              <Title level={2} className="about-subtitle !mt-2">
                From one heritage house to a nationwide network.
              </Title>
              <div className="mt-6 space-y-6">
                {TIMELINE.map((item) => (
                  <div key={item.year} className="flex gap-4">
                    <div className="pt-1 text-cyan-700 font-semibold">
                      {item.year}
                    </div>
                    <div>
                      <div className="text-base font-semibold text-slate-800">
                        {item.title}
                      </div>
                      <div className="text-sm text-slate-600">
                        {item.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-8">
              <Text className="text-xs uppercase tracking-[0.3em] text-slate-500">
                Our footprint
              </Text>
              <Title level={3} className="!mt-2 text-cyan-700">
                Signature destinations
              </Title>
              <div className="mt-6 space-y-4">
                {LOCATIONS.map((location) => (
                  <div
                    key={location.name}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="text-sm font-semibold text-slate-800">
                      {location.name}
                    </div>
                    <div className="text-xs text-slate-500">
                      {location.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-20 rounded-3xl border border-slate-200 bg-gradient-to-r from-cyan-100/80 to-indigo-100/70 p-8">
            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div>
                <Title level={3} className="!mt-0 text-slate-900">
                  Ready to plan your next stay?
                </Title>
                <Text className="text-slate-600">
                  Browse rooms by destination or talk with our team to curate a
                  group itinerary.
                </Text>
              </div>
              <div className="flex flex-wrap gap-3 lg:justify-end">
                <Button
                  size="large"
                  className="rounded-full border border-slate-300 bg-transparent text-slate-700"
                >
                  Talk to us
                </Button>
                <Button
                  type="primary"
                  size="large"
                  className="rounded-full bg-cyan-600 border-none text-white"
                >
                  View rooms
                </Button>
              </div>
            </div>
          </div>
        </div>
        <style jsx global>{`
          @import url("https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;600;700&family=Playfair+Display:wght@500;600;700&display=swap");
          .about-hero {
            background: radial-gradient(circle at 10% 20%, rgba(34, 211, 238, 0.18), transparent 45%),
              radial-gradient(circle at 80% 10%, rgba(99, 102, 241, 0.16), transparent 40%),
              radial-gradient(circle at 50% 90%, rgba(14, 116, 144, 0.18), transparent 45%);
            opacity: 1;
          }
          .about-title {
            font-family: "Playfair Display", serif;
            color: #0f172a !important;
            font-weight: 600;
          }
          .about-subtitle {
            font-family: "Playfair Display", serif;
            color: #1f2937 !important;
          }
          body {
            font-family: "Manrope", sans-serif;
          }
          .about-card {
            animation: float 8s ease-in-out infinite;
          }
          @keyframes float {
            0%,
            100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-10px);
            }
          }
        `}</style>
      </Content>
      <ClientFooter />
    </Layout>
  );
}
