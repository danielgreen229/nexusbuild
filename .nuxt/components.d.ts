
import type { DefineComponent, SlotsType } from 'vue'
type IslandComponent<T extends DefineComponent> = T & DefineComponent<{}, {refresh: () => Promise<void>}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, SlotsType<{ fallback: { error: unknown } }>>
type HydrationStrategies = {
  hydrateOnVisible?: IntersectionObserverInit | true
  hydrateOnIdle?: number | true
  hydrateOnInteraction?: keyof HTMLElementEventMap | Array<keyof HTMLElementEventMap> | true
  hydrateOnMediaQuery?: string
  hydrateAfter?: number
  hydrateWhen?: boolean
  hydrateNever?: true
}
type LazyComponent<T> = (T & DefineComponent<HydrationStrategies, {}, {}, {}, {}, {}, {}, { hydrated: () => void }>)
interface _GlobalComponents {
      'DomainFinder': typeof import("../components/domain/domain-finder.vue")['default']
    'LandingSectionCom': typeof import("../components/landing/SectionCom.vue")['default']
    'LandingB0': typeof import("../components/landing/b0.vue")['default']
    'LandingB1': typeof import("../components/landing/b1.vue")['default']
    'LayoutFooter': typeof import("../components/layout/Footer.vue")['default']
    'LayoutHeader': typeof import("../components/layout/Header.vue")['default']
    'PortfolioCTA': typeof import("../components/portfolio/PortfolioCTA.vue")['default']
    'PortfolioFilters': typeof import("../components/portfolio/PortfolioFilters.vue")['default']
    'PortfolioGrid': typeof import("../components/portfolio/PortfolioGrid.vue")['default']
    'PortfolioHero': typeof import("../components/portfolio/PortfolioHero.vue")['default']
    'PortfolioTemplateCard': typeof import("../components/portfolio/TemplateCard.vue")['default']
    'ProfileModalsForgotPasswordModal': typeof import("../components/profile/Modals/ForgotPasswordModal.vue")['default']
    'ProfileModalsLoginModal': typeof import("../components/profile/Modals/LoginModal.vue")['default']
    'ProfileModalsRegisterModal': typeof import("../components/profile/Modals/RegisterModal.vue")['default']
    'ProfileBalance': typeof import("../components/profile/ProfileBalance.vue")['default']
    'ProfileInfo': typeof import("../components/profile/ProfileInfo.vue")['default']
    'ProfileOrders': typeof import("../components/profile/ProfileOrders.vue")['default']
    'ProfileSettings': typeof import("../components/profile/ProfileSettings.vue")['default']
    'SectionsFeatures': typeof import("../components/sections/Features.vue")['default']
    'SectionsHero': typeof import("../components/sections/Hero.vue")['default']
    'SectionsLeadForm': typeof import("../components/sections/LeadForm.vue")['default']
    'SectionsPromo': typeof import("../components/sections/Promo.vue")['default']
    'SectionsServices': typeof import("../components/sections/Services.vue")['default']
    'UiBlockHeader': typeof import("../components/ui/BlockHeader.vue")['default']
    'UiButton': typeof import("../components/ui/Button.vue")['default']
    'UiModalAlert': typeof import("../components/ui/Modal/Alert.vue")['default']
    'UiNavLandingHeader': typeof import("../components/ui/Nav/LandingHeader.vue")['default']
    'UiPromoCard': typeof import("../components/ui/PromoCard.vue")['default']
    'UiServiceCard': typeof import("../components/ui/ServiceCard.vue")['default']
    'UiBlocksCorner': typeof import("../components/ui/blocks/corner.vue")['default']
    'SvgoBigEmail': typeof import("../assets/icons/big-email")['default']
    'SvgoIconClick': typeof import("../assets/icons/icon-click")['default']
    'SvgoLandingCone': typeof import("../assets/icons/landing/Cone")['default']
    'SvgoLandingBg': typeof import("../assets/icons/landing/bg")['default']
    'SvgoLandingBlockBgMobile': typeof import("../assets/icons/landing/block-bg-mobile")['default']
    'SvgoLandingBlockBg': typeof import("../assets/icons/landing/block-bg")['default']
    'SvgoLandingBlockBg1': typeof import("../assets/icons/landing/block-bg1")['default']
    'SvgoLandingBlockBg2': typeof import("../assets/icons/landing/block-bg2")['default']
    'SvgoLandingMouse': typeof import("../assets/icons/landing/mouse")['default']
    'SvgoLogo': typeof import("../assets/icons/logo")['default']
    'SvgoNextCircle': typeof import("../assets/icons/next-circle")['default']
    'SvgoOpenNext': typeof import("../assets/icons/open-next")['default']
    'SvgoTg': typeof import("../assets/icons/tg")['default']
    'SvgoUser': typeof import("../assets/icons/user")['default']
    'NuxtWelcome': typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']
    'NuxtLayout': typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']
    'NuxtErrorBoundary': typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
    'ClientOnly': typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']
    'DevOnly': typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']
    'ServerPlaceholder': typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']
    'NuxtLink': typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']
    'NuxtLoadingIndicator': typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
    'NuxtTime': typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
    'NuxtRouteAnnouncer': typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
    'NuxtImg': typeof import("../node_modules/@nuxt/image/dist/runtime/components/NuxtImg.vue")['default']
    'NuxtPicture': typeof import("../node_modules/@nuxt/image/dist/runtime/components/NuxtPicture.vue")['default']
    'NuxtIcon': typeof import("../node_modules/nuxt-svgo/dist/runtime/components/nuxt-icon.vue")['default']
    'NuxtPage': typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']
    'NoScript': typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']
    'Link': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']
    'Base': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']
    'Title': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']
    'Meta': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']
    'Style': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']
    'Head': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']
    'Html': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']
    'Body': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']
    'NuxtIsland': typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']
    'NuxtRouteAnnouncer': IslandComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
      'LazyDomainFinder': LazyComponent<typeof import("../components/domain/domain-finder.vue")['default']>
    'LazyLandingSectionCom': LazyComponent<typeof import("../components/landing/SectionCom.vue")['default']>
    'LazyLandingB0': LazyComponent<typeof import("../components/landing/b0.vue")['default']>
    'LazyLandingB1': LazyComponent<typeof import("../components/landing/b1.vue")['default']>
    'LazyLayoutFooter': LazyComponent<typeof import("../components/layout/Footer.vue")['default']>
    'LazyLayoutHeader': LazyComponent<typeof import("../components/layout/Header.vue")['default']>
    'LazyPortfolioCTA': LazyComponent<typeof import("../components/portfolio/PortfolioCTA.vue")['default']>
    'LazyPortfolioFilters': LazyComponent<typeof import("../components/portfolio/PortfolioFilters.vue")['default']>
    'LazyPortfolioGrid': LazyComponent<typeof import("../components/portfolio/PortfolioGrid.vue")['default']>
    'LazyPortfolioHero': LazyComponent<typeof import("../components/portfolio/PortfolioHero.vue")['default']>
    'LazyPortfolioTemplateCard': LazyComponent<typeof import("../components/portfolio/TemplateCard.vue")['default']>
    'LazyProfileModalsForgotPasswordModal': LazyComponent<typeof import("../components/profile/Modals/ForgotPasswordModal.vue")['default']>
    'LazyProfileModalsLoginModal': LazyComponent<typeof import("../components/profile/Modals/LoginModal.vue")['default']>
    'LazyProfileModalsRegisterModal': LazyComponent<typeof import("../components/profile/Modals/RegisterModal.vue")['default']>
    'LazyProfileBalance': LazyComponent<typeof import("../components/profile/ProfileBalance.vue")['default']>
    'LazyProfileInfo': LazyComponent<typeof import("../components/profile/ProfileInfo.vue")['default']>
    'LazyProfileOrders': LazyComponent<typeof import("../components/profile/ProfileOrders.vue")['default']>
    'LazyProfileSettings': LazyComponent<typeof import("../components/profile/ProfileSettings.vue")['default']>
    'LazySectionsFeatures': LazyComponent<typeof import("../components/sections/Features.vue")['default']>
    'LazySectionsHero': LazyComponent<typeof import("../components/sections/Hero.vue")['default']>
    'LazySectionsLeadForm': LazyComponent<typeof import("../components/sections/LeadForm.vue")['default']>
    'LazySectionsPromo': LazyComponent<typeof import("../components/sections/Promo.vue")['default']>
    'LazySectionsServices': LazyComponent<typeof import("../components/sections/Services.vue")['default']>
    'LazyUiBlockHeader': LazyComponent<typeof import("../components/ui/BlockHeader.vue")['default']>
    'LazyUiButton': LazyComponent<typeof import("../components/ui/Button.vue")['default']>
    'LazyUiModalAlert': LazyComponent<typeof import("../components/ui/Modal/Alert.vue")['default']>
    'LazyUiNavLandingHeader': LazyComponent<typeof import("../components/ui/Nav/LandingHeader.vue")['default']>
    'LazyUiPromoCard': LazyComponent<typeof import("../components/ui/PromoCard.vue")['default']>
    'LazyUiServiceCard': LazyComponent<typeof import("../components/ui/ServiceCard.vue")['default']>
    'LazyUiBlocksCorner': LazyComponent<typeof import("../components/ui/blocks/corner.vue")['default']>
    'LazySvgoBigEmail': LazyComponent<typeof import("../assets/icons/big-email")['default']>
    'LazySvgoIconClick': LazyComponent<typeof import("../assets/icons/icon-click")['default']>
    'LazySvgoLandingCone': LazyComponent<typeof import("../assets/icons/landing/Cone")['default']>
    'LazySvgoLandingBg': LazyComponent<typeof import("../assets/icons/landing/bg")['default']>
    'LazySvgoLandingBlockBgMobile': LazyComponent<typeof import("../assets/icons/landing/block-bg-mobile")['default']>
    'LazySvgoLandingBlockBg': LazyComponent<typeof import("../assets/icons/landing/block-bg")['default']>
    'LazySvgoLandingBlockBg1': LazyComponent<typeof import("../assets/icons/landing/block-bg1")['default']>
    'LazySvgoLandingBlockBg2': LazyComponent<typeof import("../assets/icons/landing/block-bg2")['default']>
    'LazySvgoLandingMouse': LazyComponent<typeof import("../assets/icons/landing/mouse")['default']>
    'LazySvgoLogo': LazyComponent<typeof import("../assets/icons/logo")['default']>
    'LazySvgoNextCircle': LazyComponent<typeof import("../assets/icons/next-circle")['default']>
    'LazySvgoOpenNext': LazyComponent<typeof import("../assets/icons/open-next")['default']>
    'LazySvgoTg': LazyComponent<typeof import("../assets/icons/tg")['default']>
    'LazySvgoUser': LazyComponent<typeof import("../assets/icons/user")['default']>
    'LazyNuxtWelcome': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']>
    'LazyNuxtLayout': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
    'LazyNuxtErrorBoundary': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
    'LazyClientOnly': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']>
    'LazyDevOnly': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']>
    'LazyServerPlaceholder': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
    'LazyNuxtLink': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']>
    'LazyNuxtLoadingIndicator': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
    'LazyNuxtTime': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
    'LazyNuxtRouteAnnouncer': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
    'LazyNuxtImg': LazyComponent<typeof import("../node_modules/@nuxt/image/dist/runtime/components/NuxtImg.vue")['default']>
    'LazyNuxtPicture': LazyComponent<typeof import("../node_modules/@nuxt/image/dist/runtime/components/NuxtPicture.vue")['default']>
    'LazyNuxtIcon': LazyComponent<typeof import("../node_modules/nuxt-svgo/dist/runtime/components/nuxt-icon.vue")['default']>
    'LazyNuxtPage': LazyComponent<typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']>
    'LazyNoScript': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']>
    'LazyLink': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']>
    'LazyBase': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']>
    'LazyTitle': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']>
    'LazyMeta': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']>
    'LazyStyle': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']>
    'LazyHead': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']>
    'LazyHtml': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']>
    'LazyBody': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']>
    'LazyNuxtIsland': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']>
    'LazyNuxtRouteAnnouncer': LazyComponent<IslandComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>>
}

declare module 'vue' {
  export interface GlobalComponents extends _GlobalComponents { }
}

export const DomainFinder: typeof import("../components/domain/domain-finder.vue")['default']
export const LandingSectionCom: typeof import("../components/landing/SectionCom.vue")['default']
export const LandingB0: typeof import("../components/landing/b0.vue")['default']
export const LandingB1: typeof import("../components/landing/b1.vue")['default']
export const LayoutFooter: typeof import("../components/layout/Footer.vue")['default']
export const LayoutHeader: typeof import("../components/layout/Header.vue")['default']
export const PortfolioCTA: typeof import("../components/portfolio/PortfolioCTA.vue")['default']
export const PortfolioFilters: typeof import("../components/portfolio/PortfolioFilters.vue")['default']
export const PortfolioGrid: typeof import("../components/portfolio/PortfolioGrid.vue")['default']
export const PortfolioHero: typeof import("../components/portfolio/PortfolioHero.vue")['default']
export const PortfolioTemplateCard: typeof import("../components/portfolio/TemplateCard.vue")['default']
export const ProfileModalsForgotPasswordModal: typeof import("../components/profile/Modals/ForgotPasswordModal.vue")['default']
export const ProfileModalsLoginModal: typeof import("../components/profile/Modals/LoginModal.vue")['default']
export const ProfileModalsRegisterModal: typeof import("../components/profile/Modals/RegisterModal.vue")['default']
export const ProfileBalance: typeof import("../components/profile/ProfileBalance.vue")['default']
export const ProfileInfo: typeof import("../components/profile/ProfileInfo.vue")['default']
export const ProfileOrders: typeof import("../components/profile/ProfileOrders.vue")['default']
export const ProfileSettings: typeof import("../components/profile/ProfileSettings.vue")['default']
export const SectionsFeatures: typeof import("../components/sections/Features.vue")['default']
export const SectionsHero: typeof import("../components/sections/Hero.vue")['default']
export const SectionsLeadForm: typeof import("../components/sections/LeadForm.vue")['default']
export const SectionsPromo: typeof import("../components/sections/Promo.vue")['default']
export const SectionsServices: typeof import("../components/sections/Services.vue")['default']
export const UiBlockHeader: typeof import("../components/ui/BlockHeader.vue")['default']
export const UiButton: typeof import("../components/ui/Button.vue")['default']
export const UiModalAlert: typeof import("../components/ui/Modal/Alert.vue")['default']
export const UiNavLandingHeader: typeof import("../components/ui/Nav/LandingHeader.vue")['default']
export const UiPromoCard: typeof import("../components/ui/PromoCard.vue")['default']
export const UiServiceCard: typeof import("../components/ui/ServiceCard.vue")['default']
export const UiBlocksCorner: typeof import("../components/ui/blocks/corner.vue")['default']
export const SvgoBigEmail: typeof import("../assets/icons/big-email")['default']
export const SvgoIconClick: typeof import("../assets/icons/icon-click")['default']
export const SvgoLandingCone: typeof import("../assets/icons/landing/Cone")['default']
export const SvgoLandingBg: typeof import("../assets/icons/landing/bg")['default']
export const SvgoLandingBlockBgMobile: typeof import("../assets/icons/landing/block-bg-mobile")['default']
export const SvgoLandingBlockBg: typeof import("../assets/icons/landing/block-bg")['default']
export const SvgoLandingBlockBg1: typeof import("../assets/icons/landing/block-bg1")['default']
export const SvgoLandingBlockBg2: typeof import("../assets/icons/landing/block-bg2")['default']
export const SvgoLandingMouse: typeof import("../assets/icons/landing/mouse")['default']
export const SvgoLogo: typeof import("../assets/icons/logo")['default']
export const SvgoNextCircle: typeof import("../assets/icons/next-circle")['default']
export const SvgoOpenNext: typeof import("../assets/icons/open-next")['default']
export const SvgoTg: typeof import("../assets/icons/tg")['default']
export const SvgoUser: typeof import("../assets/icons/user")['default']
export const NuxtWelcome: typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']
export const NuxtLayout: typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']
export const NuxtErrorBoundary: typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
export const ClientOnly: typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']
export const DevOnly: typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']
export const ServerPlaceholder: typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']
export const NuxtLink: typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']
export const NuxtLoadingIndicator: typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
export const NuxtTime: typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
export const NuxtRouteAnnouncer: typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
export const NuxtImg: typeof import("../node_modules/@nuxt/image/dist/runtime/components/NuxtImg.vue")['default']
export const NuxtPicture: typeof import("../node_modules/@nuxt/image/dist/runtime/components/NuxtPicture.vue")['default']
export const NuxtIcon: typeof import("../node_modules/nuxt-svgo/dist/runtime/components/nuxt-icon.vue")['default']
export const NuxtPage: typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']
export const NoScript: typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']
export const Link: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']
export const Base: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']
export const Title: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']
export const Meta: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']
export const Style: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']
export const Head: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']
export const Html: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']
export const Body: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']
export const NuxtIsland: typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']
export const NuxtRouteAnnouncer: IslandComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
export const LazyDomainFinder: LazyComponent<typeof import("../components/domain/domain-finder.vue")['default']>
export const LazyLandingSectionCom: LazyComponent<typeof import("../components/landing/SectionCom.vue")['default']>
export const LazyLandingB0: LazyComponent<typeof import("../components/landing/b0.vue")['default']>
export const LazyLandingB1: LazyComponent<typeof import("../components/landing/b1.vue")['default']>
export const LazyLayoutFooter: LazyComponent<typeof import("../components/layout/Footer.vue")['default']>
export const LazyLayoutHeader: LazyComponent<typeof import("../components/layout/Header.vue")['default']>
export const LazyPortfolioCTA: LazyComponent<typeof import("../components/portfolio/PortfolioCTA.vue")['default']>
export const LazyPortfolioFilters: LazyComponent<typeof import("../components/portfolio/PortfolioFilters.vue")['default']>
export const LazyPortfolioGrid: LazyComponent<typeof import("../components/portfolio/PortfolioGrid.vue")['default']>
export const LazyPortfolioHero: LazyComponent<typeof import("../components/portfolio/PortfolioHero.vue")['default']>
export const LazyPortfolioTemplateCard: LazyComponent<typeof import("../components/portfolio/TemplateCard.vue")['default']>
export const LazyProfileModalsForgotPasswordModal: LazyComponent<typeof import("../components/profile/Modals/ForgotPasswordModal.vue")['default']>
export const LazyProfileModalsLoginModal: LazyComponent<typeof import("../components/profile/Modals/LoginModal.vue")['default']>
export const LazyProfileModalsRegisterModal: LazyComponent<typeof import("../components/profile/Modals/RegisterModal.vue")['default']>
export const LazyProfileBalance: LazyComponent<typeof import("../components/profile/ProfileBalance.vue")['default']>
export const LazyProfileInfo: LazyComponent<typeof import("../components/profile/ProfileInfo.vue")['default']>
export const LazyProfileOrders: LazyComponent<typeof import("../components/profile/ProfileOrders.vue")['default']>
export const LazyProfileSettings: LazyComponent<typeof import("../components/profile/ProfileSettings.vue")['default']>
export const LazySectionsFeatures: LazyComponent<typeof import("../components/sections/Features.vue")['default']>
export const LazySectionsHero: LazyComponent<typeof import("../components/sections/Hero.vue")['default']>
export const LazySectionsLeadForm: LazyComponent<typeof import("../components/sections/LeadForm.vue")['default']>
export const LazySectionsPromo: LazyComponent<typeof import("../components/sections/Promo.vue")['default']>
export const LazySectionsServices: LazyComponent<typeof import("../components/sections/Services.vue")['default']>
export const LazyUiBlockHeader: LazyComponent<typeof import("../components/ui/BlockHeader.vue")['default']>
export const LazyUiButton: LazyComponent<typeof import("../components/ui/Button.vue")['default']>
export const LazyUiModalAlert: LazyComponent<typeof import("../components/ui/Modal/Alert.vue")['default']>
export const LazyUiNavLandingHeader: LazyComponent<typeof import("../components/ui/Nav/LandingHeader.vue")['default']>
export const LazyUiPromoCard: LazyComponent<typeof import("../components/ui/PromoCard.vue")['default']>
export const LazyUiServiceCard: LazyComponent<typeof import("../components/ui/ServiceCard.vue")['default']>
export const LazyUiBlocksCorner: LazyComponent<typeof import("../components/ui/blocks/corner.vue")['default']>
export const LazySvgoBigEmail: LazyComponent<typeof import("../assets/icons/big-email")['default']>
export const LazySvgoIconClick: LazyComponent<typeof import("../assets/icons/icon-click")['default']>
export const LazySvgoLandingCone: LazyComponent<typeof import("../assets/icons/landing/Cone")['default']>
export const LazySvgoLandingBg: LazyComponent<typeof import("../assets/icons/landing/bg")['default']>
export const LazySvgoLandingBlockBgMobile: LazyComponent<typeof import("../assets/icons/landing/block-bg-mobile")['default']>
export const LazySvgoLandingBlockBg: LazyComponent<typeof import("../assets/icons/landing/block-bg")['default']>
export const LazySvgoLandingBlockBg1: LazyComponent<typeof import("../assets/icons/landing/block-bg1")['default']>
export const LazySvgoLandingBlockBg2: LazyComponent<typeof import("../assets/icons/landing/block-bg2")['default']>
export const LazySvgoLandingMouse: LazyComponent<typeof import("../assets/icons/landing/mouse")['default']>
export const LazySvgoLogo: LazyComponent<typeof import("../assets/icons/logo")['default']>
export const LazySvgoNextCircle: LazyComponent<typeof import("../assets/icons/next-circle")['default']>
export const LazySvgoOpenNext: LazyComponent<typeof import("../assets/icons/open-next")['default']>
export const LazySvgoTg: LazyComponent<typeof import("../assets/icons/tg")['default']>
export const LazySvgoUser: LazyComponent<typeof import("../assets/icons/user")['default']>
export const LazyNuxtWelcome: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']>
export const LazyNuxtLayout: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
export const LazyNuxtErrorBoundary: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
export const LazyClientOnly: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']>
export const LazyDevOnly: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']>
export const LazyServerPlaceholder: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
export const LazyNuxtLink: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']>
export const LazyNuxtLoadingIndicator: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
export const LazyNuxtTime: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
export const LazyNuxtRouteAnnouncer: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
export const LazyNuxtImg: LazyComponent<typeof import("../node_modules/@nuxt/image/dist/runtime/components/NuxtImg.vue")['default']>
export const LazyNuxtPicture: LazyComponent<typeof import("../node_modules/@nuxt/image/dist/runtime/components/NuxtPicture.vue")['default']>
export const LazyNuxtIcon: LazyComponent<typeof import("../node_modules/nuxt-svgo/dist/runtime/components/nuxt-icon.vue")['default']>
export const LazyNuxtPage: LazyComponent<typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']>
export const LazyNoScript: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']>
export const LazyLink: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']>
export const LazyBase: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']>
export const LazyTitle: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']>
export const LazyMeta: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']>
export const LazyStyle: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']>
export const LazyHead: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']>
export const LazyHtml: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']>
export const LazyBody: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']>
export const LazyNuxtIsland: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']>
export const LazyNuxtRouteAnnouncer: LazyComponent<IslandComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>>

export const componentNames: string[]
