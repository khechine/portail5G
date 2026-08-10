import type { Schema, Struct } from '@strapi/strapi';

export interface SharedAboutSection extends Struct.ComponentSchema {
  collectionName: 'components_shared_about_sections';
  info: {
    description: 'Section \u00C0 propos';
    displayName: 'About Section';
    icon: 'information';
  };
  attributes: {
    buttonLabel: Schema.Attribute.String;
    buttonUrl: Schema.Attribute.String;
    enabled: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    features: Schema.Attribute.Component<'shared.list-item', true>;
    image: Schema.Attribute.Media<'images'>;
    tagline: Schema.Attribute.String;
    text: Schema.Attribute.Text;
    title: Schema.Attribute.Text;
    titleHighlight: Schema.Attribute.String;
  };
}

export interface SharedCtaSection extends Struct.ComponentSchema {
  collectionName: 'components_shared_cta_sections';
  info: {
    description: "Bandeau d'appel \u00E0 l'action final";
    displayName: 'CTA Section';
    icon: 'megaphone';
  };
  attributes: {
    background: Schema.Attribute.Media<'images'>;
    btnLabel: Schema.Attribute.String;
    btnSecondaryLabel: Schema.Attribute.String;
    btnSecondaryUrl: Schema.Attribute.String;
    btnUrl: Schema.Attribute.String;
    enabled: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface SharedFaqItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_faq_items';
  info: {
    description: 'Une question / r\u00E9ponse du FAQ';
    displayName: 'FAQ Item';
    icon: 'question';
  };
  attributes: {
    answer: Schema.Attribute.Text;
    question: Schema.Attribute.String;
  };
}

export interface SharedFaqSection extends Struct.ComponentSchema {
  collectionName: 'components_shared_faq_sections';
  info: {
    description: 'Foire aux questions';
    displayName: 'FAQ Section';
    icon: 'question';
  };
  attributes: {
    enabled: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    items: Schema.Attribute.Component<'shared.faq-item', true>;
    tagline: Schema.Attribute.String;
    title: Schema.Attribute.Text;
    titleHighlight: Schema.Attribute.String;
  };
}

export interface SharedFooterColumn extends Struct.ComponentSchema {
  collectionName: 'components_shared_footer_columns';
  info: {
    description: 'Une colonne de liens dans le footer';
    displayName: 'Footer Column';
    icon: 'layer';
  };
  attributes: {
    links: Schema.Attribute.Component<'shared.link', true>;
    title: Schema.Attribute.String;
  };
}

export interface SharedHeroSection extends Struct.ComponentSchema {
  collectionName: 'components_shared_hero_sections';
  info: {
    description: 'Slider principal (banni\u00E8res)';
    displayName: 'Hero Section';
    icon: 'layout';
  };
  attributes: {
    enabled: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    slides: Schema.Attribute.Component<'shared.hero-slide', true>;
  };
}

export interface SharedHeroSlide extends Struct.ComponentSchema {
  collectionName: 'components_shared_hero_slides';
  info: {
    description: 'Une slide du slider principal (banni\u00E8re)';
    displayName: 'Hero Slide';
    icon: 'layout';
  };
  attributes: {
    badge: Schema.Attribute.String;
    btnPrimaryLabel: Schema.Attribute.String;
    btnPrimaryUrl: Schema.Attribute.String;
    btnSecondaryLabel: Schema.Attribute.String;
    btnSecondaryUrl: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    text: Schema.Attribute.Text;
    title: Schema.Attribute.Text;
    titleHighlight: Schema.Attribute.Text;
  };
}

export interface SharedLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_links';
  info: {
    description: 'Un lien (libell\u00E9 + URL)';
    displayName: 'Link';
    icon: 'link';
  };
  attributes: {
    label: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface SharedListItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_list_items';
  info: {
    description: "Une ligne d'une liste (avantage, caract\u00E9ristique, option...)";
    displayName: 'List Item';
    icon: 'check-circle';
  };
  attributes: {
    text: Schema.Attribute.String;
  };
}

export interface SharedNewsPost extends Struct.ComponentSchema {
  collectionName: 'components_shared_news_posts';
  info: {
    description: 'Un article / actualit\u00E9';
    displayName: 'News Post';
    icon: 'calendar';
  };
  attributes: {
    date: Schema.Attribute.String;
    excerpt: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images'>;
    link: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface SharedNewsSection extends Struct.ComponentSchema {
  collectionName: 'components_shared_news_sections';
  info: {
    description: 'Actualit\u00E9s / blog';
    displayName: 'News Section';
    icon: 'calendar';
  };
  attributes: {
    enabled: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    items: Schema.Attribute.Component<'shared.news-post', true>;
    tagline: Schema.Attribute.String;
    title: Schema.Attribute.Text;
    titleHighlight: Schema.Attribute.String;
  };
}

export interface SharedNewsletterSection extends Struct.ComponentSchema {
  collectionName: 'components_shared_newsletter_sections';
  info: {
    description: 'Inscription newsletter';
    displayName: 'Newsletter Section';
    icon: 'mail';
  };
  attributes: {
    buttonLabel: Schema.Attribute.String;
    enabled: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    msgEmail: Schema.Attribute.String;
    msgError: Schema.Attribute.String;
    msgSuccess: Schema.Attribute.String;
    placeholder: Schema.Attribute.String;
    subtitle: Schema.Attribute.Text;
    tagline: Schema.Attribute.String;
    title: Schema.Attribute.Text;
    titleHighlight: Schema.Attribute.String;
  };
}

export interface SharedOrderSection extends Struct.ComponentSchema {
  collectionName: 'components_shared_order_sections';
  info: {
    description: 'Formulaire de commande';
    displayName: 'Order Section';
    icon: 'envelope';
  };
  attributes: {
    disclaimer: Schema.Attribute.Text;
    enabled: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    governorates: Schema.Attribute.Component<'shared.list-item', true>;
    labelAddress: Schema.Attribute.String;
    labelExisting: Schema.Attribute.String;
    labelFirstname: Schema.Attribute.String;
    labelGovernorate: Schema.Attribute.String;
    labelLastname: Schema.Attribute.String;
    labelPhone: Schema.Attribute.String;
    labelPlan: Schema.Attribute.String;
    msgError: Schema.Attribute.String;
    msgRequired: Schema.Attribute.String;
    msgSuccess: Schema.Attribute.String;
    optionNo: Schema.Attribute.String;
    optionYes: Schema.Attribute.String;
    placeholderAddress: Schema.Attribute.String;
    placeholderFirstname: Schema.Attribute.String;
    placeholderGovernorate: Schema.Attribute.String;
    placeholderLastname: Schema.Attribute.String;
    placeholderPhone: Schema.Attribute.String;
    submitLabel: Schema.Attribute.String;
    subtitle: Schema.Attribute.Text;
    tagline: Schema.Attribute.String;
    title: Schema.Attribute.Text;
    titleHighlight: Schema.Attribute.String;
  };
}

export interface SharedPlanCard extends Struct.ComponentSchema {
  collectionName: 'components_shared_plan_cards';
  info: {
    description: 'Une offre / carte tarifaire';
    displayName: 'Plan Card';
    icon: 'price-tag';
  };
  attributes: {
    badge: Schema.Attribute.String;
    buttonLabel: Schema.Attribute.String;
    buttonUrl: Schema.Attribute.String;
    currency: Schema.Attribute.String;
    features: Schema.Attribute.Component<'shared.list-item', true>;
    image: Schema.Attribute.Media<'images'>;
    period: Schema.Attribute.String;
    price: Schema.Attribute.String;
    recommended: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    speed: Schema.Attribute.String;
    speedLabel: Schema.Attribute.String;
    speedUnit: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface SharedPlanGroup extends Struct.ComponentSchema {
  collectionName: 'components_shared_plan_groups';
  info: {
    description: "Un groupe d'offres (onglet). Ex : '30M', '50M', '100M'.";
    displayName: 'Plan Group';
    icon: 'bulletList';
  };
  attributes: {
    cards: Schema.Attribute.Component<'shared.plan-card', true>;
    name: Schema.Attribute.String;
  };
}

export interface SharedPlansSection extends Struct.ComponentSchema {
  collectionName: 'components_shared_plans_sections';
  info: {
    description: 'Offres tarifaires avec onglets par d\u00E9bit';
    displayName: 'Plans Section';
    icon: 'price-tag';
  };
  attributes: {
    enabled: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    groups: Schema.Attribute.Component<'shared.plan-group', true>;
    note: Schema.Attribute.Text;
    subtitle: Schema.Attribute.Text;
    tagline: Schema.Attribute.String;
    title: Schema.Attribute.Text;
    titleHighlight: Schema.Attribute.String;
  };
}

export interface SharedServiceItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_service_items';
  info: {
    description: 'Une carte service (ic\u00F4ne, titre, description, points forts)';
    displayName: 'Service Item';
    icon: 'apps';
  };
  attributes: {
    description: Schema.Attribute.Text;
    features: Schema.Attribute.Component<'shared.list-item', true>;
    icon: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface SharedServicesSection extends Struct.ComponentSchema {
  collectionName: 'components_shared_services_sections';
  info: {
    description: 'Cartes services / offres';
    displayName: 'Services Section';
    icon: 'apps';
  };
  attributes: {
    enabled: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    items: Schema.Attribute.Component<'shared.service-item', true>;
    subtitle: Schema.Attribute.Text;
    tagline: Schema.Attribute.String;
    title: Schema.Attribute.Text;
    titleHighlight: Schema.Attribute.String;
  };
}

export interface SharedSpecRow extends Struct.ComponentSchema {
  collectionName: 'components_shared_spec_rows';
  info: {
    description: 'Une ligne de la fiche technique';
    displayName: 'Spec Row';
    icon: 'table';
  };
  attributes: {
    highlight: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    label: Schema.Attribute.String;
    value: Schema.Attribute.String;
  };
}

export interface SharedSpecsSection extends Struct.ComponentSchema {
  collectionName: 'components_shared_specs_sections';
  info: {
    description: 'Fiche technique de la Box';
    displayName: 'Specs Section';
    icon: 'table';
  };
  attributes: {
    enabled: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    image: Schema.Attribute.Media<'images'>;
    rows: Schema.Attribute.Component<'shared.spec-row', true>;
    tagline: Schema.Attribute.String;
    title: Schema.Attribute.Text;
    titleHighlight: Schema.Attribute.String;
  };
}

export interface SharedStep extends Struct.ComponentSchema {
  collectionName: 'components_shared_steps';
  info: {
    description: 'Une \u00E9tape de mise en marche';
    displayName: 'Step';
    icon: 'number';
  };
  attributes: {
    description: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface SharedStepsSection extends Struct.ComponentSchema {
  collectionName: 'components_shared_steps_sections';
  info: {
    description: "\u00C9tapes de mise en marche + bo\u00EEte d'aide";
    displayName: 'Steps Section';
    icon: 'number';
  };
  attributes: {
    enabled: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    helpText: Schema.Attribute.Text;
    helpTitle: Schema.Attribute.String;
    steps: Schema.Attribute.Component<'shared.step', true>;
    tagline: Schema.Attribute.String;
    title: Schema.Attribute.Text;
    titleHighlight: Schema.Attribute.String;
  };
}

export interface SharedTestimonial extends Struct.ComponentSchema {
  collectionName: 'components_shared_testimonials';
  info: {
    description: 'Un avis client';
    displayName: 'Testimonial';
    icon: 'user';
  };
  attributes: {
    author: Schema.Attribute.String;
    avatar: Schema.Attribute.Media<'images'>;
    quote: Schema.Attribute.Text;
    rating: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 5;
          min: 0;
        },
        number
      >;
    role: Schema.Attribute.String;
  };
}

export interface SharedTestimonialsSection extends Struct.ComponentSchema {
  collectionName: 'components_shared_testimonials_sections';
  info: {
    description: 'Avis clients';
    displayName: 'Testimonials Section';
    icon: 'user';
  };
  attributes: {
    enabled: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    items: Schema.Attribute.Component<'shared.testimonial', true>;
    tagline: Schema.Attribute.String;
    title: Schema.Attribute.Text;
    titleHighlight: Schema.Attribute.String;
  };
}

export interface SharedTrustItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_trust_items';
  info: {
    description: 'Un indicateur du bandeau de confiance (ex : 5G + 4G / R\u00E9seau hybride)';
    displayName: 'Trust Item';
    icon: 'check';
  };
  attributes: {
    label: Schema.Attribute.String;
    value: Schema.Attribute.String;
  };
}

export interface SharedTrustSection extends Struct.ComponentSchema {
  collectionName: 'components_shared_trust_sections';
  info: {
    description: 'Bandeau de confiance (stats)';
    displayName: 'Trust Section';
    icon: 'check';
  };
  attributes: {
    enabled: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    items: Schema.Attribute.Component<'shared.trust-item', true>;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'shared.about-section': SharedAboutSection;
      'shared.cta-section': SharedCtaSection;
      'shared.faq-item': SharedFaqItem;
      'shared.faq-section': SharedFaqSection;
      'shared.footer-column': SharedFooterColumn;
      'shared.hero-section': SharedHeroSection;
      'shared.hero-slide': SharedHeroSlide;
      'shared.link': SharedLink;
      'shared.list-item': SharedListItem;
      'shared.news-post': SharedNewsPost;
      'shared.news-section': SharedNewsSection;
      'shared.newsletter-section': SharedNewsletterSection;
      'shared.order-section': SharedOrderSection;
      'shared.plan-card': SharedPlanCard;
      'shared.plan-group': SharedPlanGroup;
      'shared.plans-section': SharedPlansSection;
      'shared.service-item': SharedServiceItem;
      'shared.services-section': SharedServicesSection;
      'shared.spec-row': SharedSpecRow;
      'shared.specs-section': SharedSpecsSection;
      'shared.step': SharedStep;
      'shared.steps-section': SharedStepsSection;
      'shared.testimonial': SharedTestimonial;
      'shared.testimonials-section': SharedTestimonialsSection;
      'shared.trust-item': SharedTrustItem;
      'shared.trust-section': SharedTrustSection;
    }
  }
}
