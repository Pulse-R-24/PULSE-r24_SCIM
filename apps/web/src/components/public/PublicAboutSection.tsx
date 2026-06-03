export function PublicAboutSection() {
  return (
    <section id="about" className="border-t border-slate-100 bg-white py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="public-rule-label mb-12">
          <span className="h-px w-10 bg-[#8b0000]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#8b0000]" />
          <span>About PULSE-R24</span>
        </div>

        <div className="space-y-12">
          <div className="space-y-6">
            <h2 className="font-editorial border-l-4 border-[#8b0000] py-2 pl-6 text-3xl font-black uppercase leading-tight text-slate-950 md:text-4xl">
              INDIA&apos;S FIRST INTELLIGENCE PRODUCT DELIVERED BY STUDENTS UNDER THE GUIDANCE OF SECURITY LEADERS AND PROFESSIONALS
            </h2>
            <p className="text-lg leading-8 text-slate-600">
              The Pulse-R24 is a structured, forward-looking intelligence product presented by the International Society for Security
              Professionals (ISSP) in collaboration with the students of Rashtriya Raksha University (RRU), Puducherry Campus, enrolled
              in the PGDM program in Security and Corporate Intelligence Management. Delivered each morning, the bulletin focuses on
              identifying emerging risks, early warning indicators, and upcoming developments that may impact organizational stability,
              business operations, and sectoral continuity.
            </p>
          </div>

          <div className="grid gap-10 border-y border-slate-100 py-10 md:grid-cols-2">
            <article className="space-y-4">
              <h3 className="font-editorial text-xl font-black uppercase tracking-wide text-[#600000]">Evolution of Resilience</h3>
              <p className="text-sm leading-7 text-slate-600">
                PULSE-R24 represents a significant evolution in business continuity and resilience management for Indian enterprises.
                Moving beyond conventional risk assessment models and static response frameworks, it delivers real-time, actionable
                intelligence across multiple critical risk vectors, aligned with an organization&apos;s operational footprint and threat landscape.
              </p>
            </article>
            <article className="space-y-4">
              <h3 className="font-editorial text-xl font-black uppercase tracking-wide text-[#600000]">Strategic Impact</h3>
              <p className="text-sm leading-7 text-slate-600">
                By integrating continuous monitoring with analytical prioritization, the platform enhances situational awareness, enables
                proactive risk mitigation, and supports informed executive decision-making to minimize operational and reputational disruptions.
                The launch of PULSE-R24 in partnership with ISSP underscores a strong commitment to bridging academia and industry.
              </p>
            </article>
          </div>

          <div className="space-y-6 pt-4">
            <h3 className="font-editorial text-2xl font-black text-slate-950">About Rashtriya Raksha University (RRU)</h3>
            <p className="text-base leading-8 text-slate-600">
              Rashtriya Raksha University (RRU), Puducherry Campus, is a premier institution dedicated to advancing education, research,
              and capacity building in the domains of national security, policing, and strategic studies. As an Institution of National
              Importance, RRU contributes significantly to strengthening India&apos;s internal security framework by developing skilled professionals
              capable of addressing evolving security challenges across public and private sectors.
            </p>
            <p className="text-base leading-8 text-slate-600">
              The Puducherry Campus reflects this mandate through a multidisciplinary learning environment that integrates academic rigor with
              practical application. Its PGDM program in Security and Corporate Intelligence Management is designed to build expertise in risk
              analysis, corporate security strategy, and intelligence-led decision-making, aligned with contemporary industry requirements.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
