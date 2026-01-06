import { PrismaClient, Category, CampaignStatus, TonePreference } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Starting seed...");

    // Clean existing data
    await prisma.event.deleteMany();
    await prisma.recommendation.deleteMany();
    await prisma.adCreative.deleteMany();
    await prisma.campaign.deleteMany();
    await prisma.advertiser.deleteMany();
    await prisma.issue.deleteMany();
    await prisma.creatorBoundaries.deleteMany();
    await prisma.creator.deleteMany();
    // Note: Not deleting users as they're managed by Supabase Auth

    console.log("✅ Cleaned existing data");

    // Create Advertisers
    const techCorp = await prisma.advertiser.create({
        data: {
            name: "TechCorp Solutions",
            website: "https://techcorp.example.com",
            contactEmail: "ads@techcorp.example.com",
            logoUrl: "https://via.placeholder.com/150?text=TechCorp",
            isActive: true,
        },
    });

    const financeHub = await prisma.advertiser.create({
        data: {
            name: "FinanceHub Pro",
            website: "https://financehub.example.com",
            contactEmail: "marketing@financehub.example.com",
            logoUrl: "https://via.placeholder.com/150?text=FinanceHub",
            isActive: true,
        },
    });

    const healthyLife = await prisma.advertiser.create({
        data: {
            name: "HealthyLife Wellness",
            website: "https://healthylife.example.com",
            contactEmail: "partners@healthylife.example.com",
            logoUrl: "https://via.placeholder.com/150?text=HealthyLife",
            isActive: true,
        },
    });

    const aiStartup = await prisma.advertiser.create({
        data: {
            name: "AI Innovations Inc",
            website: "https://aiinnovations.example.com",
            contactEmail: "sales@aiinnovations.example.com",
            logoUrl: "https://via.placeholder.com/150?text=AI+Innovations",
            isActive: true,
        },
    });

    console.log("✅ Created 4 advertisers");

    // Create Campaigns
    const now = new Date();
    const oneMonthLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const twoMonthsLater = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);

    const techCampaign1 = await prisma.campaign.create({
        data: {
            advertiserId: techCorp.id,
            name: "Developer Tools Q1 2026",
            description: "Promoting our new suite of developer productivity tools",
            targetCategories: [Category.TECHNOLOGY, Category.SAAS, Category.AI_ML],
            targetKeywords: ["developer", "coding", "productivity", "tools", "software"],
            budget: 10000,
            cpm: 8.50,
            startDate: now,
            endDate: twoMonthsLater,
            status: CampaignStatus.ACTIVE,
        },
    });

    const financeCampaign = await prisma.campaign.create({
        data: {
            advertiserId: financeHub.id,
            name: "Personal Finance App Launch",
            description: "Launch campaign for our new budgeting app",
            targetCategories: [Category.FINANCE, Category.BUSINESS, Category.LIFESTYLE],
            targetKeywords: ["finance", "budgeting", "money", "savings", "investing"],
            budget: 15000,
            cpm: 12.00,
            startDate: now,
            endDate: oneMonthLater,
            status: CampaignStatus.ACTIVE,
        },
    });

    const healthCampaign = await prisma.campaign.create({
        data: {
            advertiserId: healthyLife.id,
            name: "Wellness Summit Promotion",
            description: "Promoting our annual wellness and health summit",
            targetCategories: [Category.HEALTH, Category.LIFESTYLE, Category.EDUCATION],
            targetKeywords: ["health", "wellness", "fitness", "mindfulness", "nutrition"],
            budget: 8000,
            cpm: 6.75,
            startDate: now,
            endDate: oneMonthLater,
            status: CampaignStatus.ACTIVE,
        },
    });

    const aiCampaign = await prisma.campaign.create({
        data: {
            advertiserId: aiStartup.id,
            name: "AI Writing Assistant Beta",
            description: "Beta launch for our AI-powered writing tool",
            targetCategories: [Category.AI_ML, Category.TECHNOLOGY, Category.MARKETING],
            targetKeywords: ["ai", "artificial intelligence", "writing", "content", "automation"],
            budget: 20000,
            cpm: 15.00,
            startDate: now,
            endDate: twoMonthsLater,
            status: CampaignStatus.ACTIVE,
        },
    });

    const marketingCampaign = await prisma.campaign.create({
        data: {
            advertiserId: techCorp.id,
            name: "Marketing Platform Rebrand",
            description: "Introducing our rebranded marketing automation platform",
            targetCategories: [Category.MARKETING, Category.BUSINESS, Category.SAAS],
            targetKeywords: ["marketing", "automation", "email", "campaigns", "growth"],
            budget: 12000,
            cpm: 9.25,
            startDate: now,
            endDate: oneMonthLater,
            status: CampaignStatus.ACTIVE,
        },
    });

    console.log("✅ Created 5 campaigns");

    // Create Ad Creatives
    const creatives = [
        // TechCorp Developer Tools
        {
            campaignId: techCampaign1.id,
            headline: "Ship Code 10x Faster",
            body: "Join 50,000+ developers using TechCorp's AI-powered development suite. Auto-complete, debugging, and deployment—all in one place. Start your free trial today.",
            imageUrl: "https://via.placeholder.com/600x400?text=Developer+Tools",
            ctaText: "Start Free Trial",
            destinationUrl: "https://techcorp.example.com/devtools",
            tone: TonePreference.PROFESSIONAL,
        },
        {
            campaignId: techCampaign1.id,
            headline: "Your New Coding Superpower",
            body: "Why write boilerplate when AI can do it for you? TechCorp DevTools learns your coding style and helps you build faster. Try it free!",
            ctaText: "Try It Free",
            destinationUrl: "https://techcorp.example.com/devtools-trial",
            tone: TonePreference.CASUAL,
        },
        // FinanceHub
        {
            campaignId: financeCampaign.id,
            headline: "Take Control of Your Money",
            body: "FinanceHub Pro helps you track spending, set budgets, and reach your financial goals. Join 1M+ users who've saved an average of $2,400/year.",
            imageUrl: "https://via.placeholder.com/600x400?text=Finance+App",
            ctaText: "Download Free",
            destinationUrl: "https://financehub.example.com/app",
            tone: TonePreference.FRIENDLY,
        },
        {
            campaignId: financeCampaign.id,
            headline: "Smart Investing Made Simple",
            body: "Our AI-powered investment advisor analyzes markets 24/7 so you don't have to. Get personalized recommendations based on your risk tolerance and goals.",
            ctaText: "Get Started",
            destinationUrl: "https://financehub.example.com/invest",
            tone: TonePreference.PROFESSIONAL,
        },
        // HealthyLife
        {
            campaignId: healthCampaign.id,
            headline: "Transform Your Health Journey",
            body: "Join the HealthyLife Wellness Summit—3 days of expert talks, workshops, and networking with health professionals. Early bird tickets available now!",
            imageUrl: "https://via.placeholder.com/600x400?text=Wellness+Summit",
            ctaText: "Get Early Bird Tickets",
            destinationUrl: "https://healthylife.example.com/summit",
            tone: TonePreference.FRIENDLY,
        },
        {
            campaignId: healthCampaign.id,
            headline: "Your Daily Wellness Companion",
            body: "Track nutrition, exercise, sleep, and mindfulness in one app. HealthyLife uses science-backed methods to help you build lasting healthy habits.",
            ctaText: "Download Now",
            destinationUrl: "https://healthylife.example.com/app",
            tone: TonePreference.CASUAL,
        },
        // AI Innovations
        {
            campaignId: aiCampaign.id,
            headline: "Write Better, Faster with AI",
            body: "Our AI writing assistant helps you create compelling content in seconds. Blog posts, emails, social media—all polished and on-brand. Join the beta!",
            imageUrl: "https://via.placeholder.com/600x400?text=AI+Writing",
            ctaText: "Join Beta",
            destinationUrl: "https://aiinnovations.example.com/beta",
            tone: TonePreference.PROFESSIONAL,
        },
        {
            campaignId: aiCampaign.id,
            headline: "Writer's Block? We've Got You",
            body: "Generate ideas, outlines, and full drafts in seconds. Let AI handle the heavy lifting so you can focus on what matters—your creativity.",
            ctaText: "Try Free",
            destinationUrl: "https://aiinnovations.example.com/try",
            tone: TonePreference.CASUAL,
        },
        // Marketing Platform
        {
            campaignId: marketingCampaign.id,
            headline: "Marketing Automation That Actually Works",
            body: "Tired of complex marketing tools? Our platform simplifies email campaigns, lead scoring, and analytics. See why 10,000+ marketers made the switch.",
            imageUrl: "https://via.placeholder.com/600x400?text=Marketing+Platform",
            ctaText: "See Demo",
            destinationUrl: "https://techcorp.example.com/marketing-demo",
            tone: TonePreference.PROFESSIONAL,
        },
        {
            campaignId: marketingCampaign.id,
            headline: "Grow Your Audience on Autopilot",
            body: "Set it and forget it. Our marketing automation handles campaigns while you focus on strategy. 30-day free trial, no credit card required.",
            ctaText: "Start Free Trial",
            destinationUrl: "https://techcorp.example.com/marketing-trial",
            tone: TonePreference.FRIENDLY,
        },
    ];

    for (const creative of creatives) {
        await prisma.adCreative.create({
            data: creative,
        });
    }

    console.log("✅ Created 10 ad creatives");

    console.log("\n🎉 Seed completed successfully!");
    console.log("Summary:");
    console.log("  - 4 Advertisers");
    console.log("  - 5 Campaigns");
    console.log("  - 10 Ad Creatives");
}

main()
    .catch((e) => {
        console.error("❌ Seed failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
