// 100% Authentic Rezoni Store Data

export interface Announcement {
  id: string;
  text: string;
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  buttonText: string;
}

export interface CollectionCard {
  id: string;
  title: string;
  image: string;
  link: string;
}

export interface ProductItem {
  id: string;
  title: string;
  handle: string;
  category_tag: string;
  sub_title: string;
  price: number;
  compare_at_price: number;
  primary_image: string;
  secondary_image: string;
  swatches: string[];
}

export interface InstagramPhoto {
  id: string;
  image: string;
  link: string;
}

export const announcements: Announcement[] = [
  {
    "id": "1",
    "text": "Buy 1 @ 699 | Buy 2 @ 899 | Buy 3 @ 999"
  },
  {
    "id": "2",
    "text": "\ud83c\udf81 3 Free Gifts With Every Order"
  },
  {
    "id": "3",
    "text": "Big Summer Sale \u2013 Up to 60% Off Sitewide"
  }
];

export const desktopHeroSlides: HeroSlide[] = [
  {
    "id": "dh-1",
    "title": "Anti-Yellow Case",
    "subtitle": "Say goodbye to yellowing.",
    "image": "https://cdn.shopify.com/s/files/1/0621/7829/6040/files/DSC00062.jpg?v=1729097458",
    "link": "/products/anti-yellow-magsafe-clear-case",
    "buttonText": "SHOP NOW"
  },
  {
    "id": "dh-2",
    "title": "Football Collection",
    "subtitle": "Built for true football fans.",
    "image": "https://cdn.shopify.com/s/files/1/0621/7829/6040/files/DSC01921.jpg?v=1733748876",
    "link": "/collections/football",
    "buttonText": "SHOP NOW"
  },
  {
    "id": "dh-3",
    "title": "Reverb 2.0 Case",
    "subtitle": "Tough protection, built to last.",
    "image": "https://cdn.shopify.com/s/files/1/0621/7829/6040/files/DSC05622.jpg?v=1742986658",
    "link": "/products/reverb-2-0-impact-magsafe-clear-case",
    "buttonText": "SHOP NOW"
  },
  {
    "id": "dh-4",
    "title": "Unisex Collection",
    "subtitle": "A style for every vibe.",
    "image": "https://cdn.shopify.com/s/files/1/0621/7829/6040/files/3vv.jpg?v=1727696456",
    "link": "/collections/unisex",
    "buttonText": "SHOP NOW"
  },
  {
    "id": "dh-5",
    "title": "Polaroid Cases",
    "subtitle": "Personalize your memories.",
    "image": "https://cdn.shopify.com/s/files/1/0621/7829/6040/files/DSC08174_3600x1600_d090c346-9833-4c15-aefb-9f633d9ee02b.jpg?v=1721471704",
    "link": "/collections/custom-photo-case",
    "buttonText": "SHOP NOW"
  },
  {
    "id": "dh-6",
    "title": "Wildcats Collection",
    "subtitle": "Unleash the wild side.",
    "image": "https://cdn.shopify.com/s/files/1/0621/7829/6040/files/3600x1600.jpg?v=1721460267",
    "link": "/collections/wild-cats",
    "buttonText": "SHOP NOW"
  }
];

export const mobileHeroSlides: HeroSlide[] = [
  {
    "id": "mh-1",
    "title": "Anti-Yellow Case",
    "subtitle": "Say goodbye to yellowing.",
    "image": "https://cdn.shopify.com/s/files/1/0621/7829/6040/files/DSC09912.jpg?v=1729097458",
    "link": "/products/anti-yellow-magsafe-clear-case",
    "buttonText": "Shop Now"
  },
  {
    "id": "mh-2",
    "title": "Football Collection",
    "subtitle": "Built for true football fans.",
    "image": "https://cdn.shopify.com/s/files/1/0621/7829/6040/files/DSC01505.jpg?v=1733748877",
    "link": "/collections/football",
    "buttonText": "Shop Now"
  },
  {
    "id": "mh-3",
    "title": "Reverb 2.0 Case",
    "subtitle": "Tough protection, built to last.",
    "image": "https://cdn.shopify.com/s/files/1/0621/7829/6040/files/DSC05592.jpg?v=1742986656",
    "link": "/products/reverb-2-0-impact-magsafe-clear-case",
    "buttonText": "Shop Now"
  },
  {
    "id": "mh-4",
    "title": "Mixtape",
    "subtitle": "Vibes from the past, built for today.",
    "image": "https://cdn.shopify.com/s/files/1/0621/7829/6040/files/3vvgvt.jpg?v=1729097458",
    "link": "/collections/mixtape",
    "buttonText": "Shop Now"
  },
  {
    "id": "mh-5",
    "title": "Polaroid Cases",
    "subtitle": "Personalize your memories.",
    "image": "https://cdn.shopify.com/s/files/1/0621/7829/6040/files/DSC08174_3600x1600_d090c346-9833-4c15-aefb-9f633d9ee02b.jpg?v=1721471704",
    "link": "/collections/custom-photo-case",
    "buttonText": "Shop Now"
  }
];

export const antiYellowCards: CollectionCard[] = [
  {
    "id": "block-template--21803729125608__collection_list_3jjFeY-collection_wHMwEe",
    "link": "https://www.rezoni.com/products/anti-yellow-magsafe-clear-case",
    "image": "https://www.rezoni.com/cdn/shop/files/6_c0ebdd0a-d5a3-45ab-bf59-14744104fae1_600x.jpg?v=1729101657",
    "title": ""
  },
  {
    "id": "block-template--21803729125608__collection_list_3jjFeY-collection_rdkL79",
    "link": "/products/anti-yellow-magsafe-clear-case",
    "image": "https://www.rezoni.com/cdn/shop/files/2_3562e232-df32-48ce-8243-78648d732db3_600x.jpg?v=1729101564",
    "title": ""
  },
  {
    "id": "block-template--21803729125608__collection_list_3jjFeY-collection_BP7VCG",
    "link": "/products/anti-yellow-magsafe-clear-case",
    "image": "https://www.rezoni.com/cdn/shop/files/3_924841ab-9d00-4b67-81bf-87fd8187a026_600x.jpg?v=1729101587",
    "title": ""
  },
  {
    "id": "block-template--21803729125608__collection_list_3jjFeY-collection_KxWcmG",
    "link": "/products/anti-yellow-magsafe-clear-case",
    "image": "https://www.rezoni.com/cdn/shop/files/4_203254f2-0742-4e2e-bebc-5c949bfb131e_600x.jpg?v=1729101604",
    "title": ""
  },
  {
    "id": "block-template--21803729125608__collection_list_3jjFeY-collection_RMxmQP",
    "link": "/products/anti-yellow-magsafe-clear-case",
    "image": "https://www.rezoni.com/cdn/shop/files/5_de8d5357-6fd4-4a0e-b2b5-9b426d12d637_600x.jpg?v=1729101635",
    "title": ""
  }
];

export const reverbCards: CollectionCard[] = [
  {
    "id": "block-template--21803729125608__collection_list_LRAdty-collection_UXh3pj",
    "link": "/products/reverb-2-0-impact-magsafe-clear-case",
    "image": "https://www.rezoni.com/cdn/shop/files/1_89991005-93b0-426c-9193-0d2343d15f23_600x.jpg?v=1742193437",
    "title": ""
  },
  {
    "id": "block-template--21803729125608__collection_list_LRAdty-collection_WHFiaD",
    "link": "/products/reverb-2-0-impact-magsafe-clear-case",
    "image": "https://www.rezoni.com/cdn/shop/files/2_df64105a-fb99-45c6-b322-f0f00d10df9f_600x.jpg?v=1742193437",
    "title": ""
  },
  {
    "id": "block-template--21803729125608__collection_list_LRAdty-collection_GNEXKj",
    "link": "/products/reverb-2-0-impact-magsafe-clear-case",
    "image": "https://www.rezoni.com/cdn/shop/files/3_df6677d5-2dc3-4366-915f-82a24dad9a8d_600x.jpg?v=1742193437",
    "title": ""
  },
  {
    "id": "block-template--21803729125608__collection_list_LRAdty-collection_6CrnTm",
    "link": "/products/reverb-2-0-impact-magsafe-clear-case",
    "image": "https://www.rezoni.com/cdn/shop/files/4_f1e12621-1cb1-4530-a5cc-a30195ca70ec_600x.jpg?v=1742193437",
    "title": ""
  },
  {
    "id": "block-template--21803729125608__collection_list_LRAdty-collection_LL6DfW",
    "link": "/products/reverb-2-0-impact-magsafe-clear-case",
    "image": "https://www.rezoni.com/cdn/shop/files/5_d9067e86-1caf-4478-a970-72db366dfffb_600x.jpg?v=1742193437",
    "title": ""
  },
  {
    "id": "block-template--21803729125608__collection_list_LRAdty-collection_ACbUhb",
    "link": "/products/reverb-2-0-impact-magsafe-clear-case",
    "image": "https://www.rezoni.com/cdn/shop/files/6_3509edf9-fc4d-4154-8054-56714a346e82_600x.jpg?v=1742193437",
    "title": ""
  },
  {
    "id": "block-template--21803729125608__collection_list_LRAdty-collection_YPzJwd",
    "link": "/products/reverb-2-0-impact-magsafe-clear-case",
    "image": "https://www.rezoni.com/cdn/shop/files/7_459826e4-6645-4ba4-b91b-674761311f67_600x.jpg?v=1742193437",
    "title": ""
  },
  {
    "id": "block-template--21803729125608__collection_list_LRAdty-collection_6RzY6n",
    "link": "/products/reverb-2-0-impact-magsafe-clear-case",
    "image": "https://www.rezoni.com/cdn/shop/files/8_002704be-a19e-4081-8cfa-33f0ea8c2b8d_600x.jpg?v=1742193438",
    "title": ""
  },
  {
    "id": "block-template--21803729125608__collection_list_LRAdty-collection_jaipez",
    "link": "/pages/select-brand",
    "image": "https://www.rezoni.com/cdn/shop/files/10_21c28e50-9d21-40a6-87ae-8a7bb81287fe_600x.jpg?v=1742193437",
    "title": ""
  }
];

export const featuredCollectionsCards: CollectionCard[] = [
  {
    "id": "block-template--21803729125608__collection_list_3fAxxt-collection_Bcapdw",
    "link": "/collections/mixtape",
    "image": "https://www.rezoni.com/cdn/shop/files/1_b305f728-ba72-411b-82ae-48257a6301fa_600x.jpg?v=1729144725",
    "title": ""
  },
  {
    "id": "block-template--21803729125608__collection_list_3fAxxt-collection_EtwcxA",
    "link": "/collections/wild-cats",
    "image": "https://www.rezoni.com/cdn/shop/files/2_1a34d2e8-e132-4dde-a1bf-458366e95492_600x.jpg?v=1729144744",
    "title": ""
  },
  {
    "id": "block-template--21803729125608__collection_list_3fAxxt-collection_KeRMNz",
    "link": "/products/reverb-2-0-impact-magsafe-clear-case",
    "image": "https://www.rezoni.com/cdn/shop/files/1_5881021f-7654-4631-b2d3-61f2e65461f2_600x.jpg?v=1742193902",
    "title": ""
  },
  {
    "id": "block-template--21803729125608__collection_list_3fAxxt-collection_4tpHGD",
    "link": "/collections/custom-photo-case",
    "image": "https://www.rezoni.com/cdn/shop/files/4_f7c5ee95-97b8-490f-8d3a-b3ce6411d8d6_600x.jpg?v=1729144784",
    "title": ""
  },
  {
    "id": "block-template--21803729125608__collection_list_3fAxxt-collection_wx48aL",
    "link": "/collections/unisex",
    "image": "https://www.rezoni.com/cdn/shop/files/5_6add6e7a-9097-44fd-8330-556e52146180_600x.jpg?v=1729144807",
    "title": ""
  },
  {
    "id": "block-template--21803729125608__collection_list_3fAxxt-collection_C3RxGD",
    "link": "/products/anti-yellow-magsafe-clear-case",
    "image": "https://www.rezoni.com/cdn/shop/files/6_fb6fd29b-eefa-49e9-9b82-9c35fd8033d9_600x.jpg?v=1729144839",
    "title": ""
  },
  {
    "id": "block-template--21803729125608__collection_list_3fAxxt-collection_6rB6UW",
    "link": "/products/clearvue-neon-green",
    "image": "https://www.rezoni.com/cdn/shop/files/7_f572856c-6609-4ed0-b275-9b4f95025b7a_600x.jpg?v=1729144871",
    "title": ""
  },
  {
    "id": "block-template--21803729125608__collection_list_3fAxxt-collection_EkGDnB",
    "link": "/collections/prints-seen-on-social",
    "image": "https://www.rezoni.com/cdn/shop/files/8_47d4c778-a9d4-4167-8c18-a70ecfc18785_600x.jpg?v=1729144894",
    "title": ""
  },
  {
    "id": "block-template--21803729125608__collection_list_3fAxxt-collection_tEDkTp",
    "link": "/collections/heart",
    "image": "https://www.rezoni.com/cdn/shop/files/10_548fc089-4ebe-4d7b-8817-9fe8a5820dc3_600x.jpg?v=1729144941",
    "title": ""
  },
  {
    "id": "block-template--21803729125608__collection_list_3fAxxt-collection_HGbMAQ",
    "link": "/collections/stickers",
    "image": "https://www.rezoni.com/cdn/shop/files/11_493a1961-2f83-4fb1-a37a-c37144cb444a_600x.jpg?v=1729144959",
    "title": ""
  },
  {
    "id": "block-template--21803729125608__collection_list_3fAxxt-collection_VEWC48",
    "link": "/collections/zodiac",
    "image": "https://www.rezoni.com/cdn/shop/files/12_321942ba-63a9-4fde-90ba-03a316b167f2_600x.jpg?v=1729144980",
    "title": ""
  },
  {
    "id": "block-template--21803729125608__collection_list_3fAxxt-collection_fCjNwN",
    "link": "/products/clearvue",
    "image": "https://www.rezoni.com/cdn/shop/files/3_8ffcf264-fa98-4048-95aa-6cf26d9fae50_600x.jpg?v=1729144765",
    "title": ""
  }
];

export const personaliseCards: CollectionCard[] = [
  {
    "id": "block-template--21803729125608__collection_list_jip6Kp-collection_X74eHR",
    "link": "/collections/custom-photo-case",
    "image": "https://www.rezoni.com/cdn/shop/files/1_871e4d98-82ac-406e-a5fc-7c24e0d16562_600x.jpg?v=1727696916",
    "title": ""
  },
  {
    "id": "block-template--21803729125608__collection_list_jip6Kp-collection_hreDCK",
    "link": "/collections/custom-photo-case",
    "image": "https://www.rezoni.com/cdn/shop/files/2_7b411e75-4fdf-4af9-8fcd-213f2f776160_600x.jpg?v=1727696917",
    "title": ""
  },
  {
    "id": "block-template--21803729125608__collection_list_jip6Kp-collection_fNc79w",
    "link": "/collections/custom-photo-case",
    "image": "https://www.rezoni.com/cdn/shop/files/3_246d1439-3a59-44cd-98b5-b7acb2aeae21_600x.jpg?v=1727696917",
    "title": ""
  },
  {
    "id": "block-template--21803729125608__collection_list_jip6Kp-collection_y7WR3t",
    "link": "/collections/custom-photo-case",
    "image": "https://www.rezoni.com/cdn/shop/files/4_cc06b0e3-dab6-4792-96a8-2beac0ad1867_600x.jpg?v=1727696916",
    "title": ""
  },
  {
    "id": "block-template--21803729125608__collection_list_jip6Kp-collection_betqgy",
    "link": "/collections/custom-photo-case",
    "image": "https://www.rezoni.com/cdn/shop/files/5_aee259f2-36d3-4a64-a54a-816a21fd3273_600x.jpg?v=1727696916",
    "title": ""
  },
  {
    "id": "block-template--21803729125608__collection_list_jip6Kp-collection_U6r96r",
    "link": "/collections/custom-photo-case",
    "image": "https://www.rezoni.com/cdn/shop/files/6_174e173b-b82f-4f05-ba36-0c2e4f4b2b8b_600x.jpg?v=1727696918",
    "title": ""
  }
];

export const bestSellers: ProductItem[] = [
  {
    "id": "the-weeknd",
    "title": "The Weeknd",
    "handle": "the-weeknd",
    "category_tag": "Reverb Case",
    "sub_title": "Mixtape",
    "price": 699,
    "compare_at_price": 999,
    "primary_image": "https://www.rezoni.com/cdn/shop/files/1_87635ba5-31c5-4d04-99ef-e9d35aa351b3_950x.jpg?v=1725349229",
    "secondary_image": "https://www.rezoni.com/cdn/shop/files/2_9fac1ea5-71ef-4f31-84c4-20edd3ee57ea_950x.jpg?v=1725349229",
    "swatches": [
      "#000000",
      "#FFFFFF",
      "#E7FA2F",
      "#FCD7EB",
      "#FFABA4"
    ]
  },
  {
    "id": "serpentine",
    "title": "Serpentine",
    "handle": "serpentine",
    "category_tag": "Reverb Case",
    "sub_title": "Y2K",
    "price": 699,
    "compare_at_price": 999,
    "primary_image": "https://www.rezoni.com/cdn/shop/files/1_198ca594-5830-42ba-aff0-ebe2306194a6_950x.jpg?v=1712562796",
    "secondary_image": "https://www.rezoni.com/cdn/shop/files/2_7b832b00-9063-4c5a-8d3f-2f850f4eea01_950x.jpg?v=1712562796",
    "swatches": [
      "#FFFFFF",
      "#000000",
      "#E7FA2F",
      "#FCD7EB",
      "#FFABA4"
    ]
  },
  {
    "id": "explicit",
    "title": "Explicit",
    "handle": "explicit",
    "category_tag": "Reverb Case",
    "sub_title": "Stickers",
    "price": 699,
    "compare_at_price": 999,
    "primary_image": "https://www.rezoni.com/cdn/shop/files/1_d1dd6cde-4f21-448b-b467-3190b372131e_950x.jpg?v=1712571168",
    "secondary_image": "https://www.rezoni.com/cdn/shop/files/2_ec123fdd-59fa-4232-bd2f-e2e5b30d1514_950x.jpg?v=1712571168",
    "swatches": [
      "#FFFFFF",
      "#000000",
      "#E7FA2F",
      "#FCD7EB",
      "#FFABA4"
    ]
  },
  {
    "id": "coldplay",
    "title": "Coldplay",
    "handle": "coldplay",
    "category_tag": "Reverb Case",
    "sub_title": "Mixtape",
    "price": 699,
    "compare_at_price": 999,
    "primary_image": "https://www.rezoni.com/cdn/shop/files/1_3848db44-611c-4ab4-8365-7ff2abc550af_950x.jpg?v=1725346268",
    "secondary_image": "https://www.rezoni.com/cdn/shop/files/2_472f6945-f3be-4c5d-9692-148aa938eeef_950x.jpg?v=1725346267",
    "swatches": [
      "#000000",
      "#FFFFFF",
      "#E7FA2F",
      "#FCD7EB",
      "#FFABA4"
    ]
  },
  {
    "id": "metallica",
    "title": "Metallica",
    "handle": "metallica",
    "category_tag": "Reverb Case",
    "sub_title": "Mixtape",
    "price": 699,
    "compare_at_price": 999,
    "primary_image": "https://www.rezoni.com/cdn/shop/files/1_032ddca2-4a2e-47fb-bb14-bdabe84b1af8_950x.jpg?v=1725343737",
    "secondary_image": "https://www.rezoni.com/cdn/shop/files/2_5f940516-42c5-4ba0-a92c-06e61198ce94_950x.jpg?v=1725343737",
    "swatches": [
      "#000000",
      "#FFFFFF",
      "#E7FA2F",
      "#FCD7EB",
      "#FFABA4"
    ]
  },
  {
    "id": "linkin-park",
    "title": "Linkin Park",
    "handle": "linkin-park",
    "category_tag": "Reverb Case",
    "sub_title": "Mixtape",
    "price": 699,
    "compare_at_price": 999,
    "primary_image": "https://www.rezoni.com/cdn/shop/files/1_bd08b697-700f-4aca-a774-c06d2c42011a_950x.jpg?v=1725346469",
    "secondary_image": "https://www.rezoni.com/cdn/shop/files/2_1bc53bee-606f-4a06-ad1d-443de1a6a2de_950x.jpg?v=1725346469",
    "swatches": [
      "#000000",
      "#FFFFFF",
      "#E7FA2F",
      "#FCD7EB",
      "#FFABA4"
    ]
  },
  {
    "id": "nirvana",
    "title": "Nirvana",
    "handle": "nirvana",
    "category_tag": "Reverb Case",
    "sub_title": "Mixtape",
    "price": 699,
    "compare_at_price": 999,
    "primary_image": "https://www.rezoni.com/cdn/shop/files/1_595832ef-93a8-49ff-b356-3f766dd4fca7_950x.jpg?v=1725343963",
    "secondary_image": "https://www.rezoni.com/cdn/shop/files/2_9b4b15ca-b010-4289-a8ae-96b1aa0f3a6b_950x.jpg?v=1725343963",
    "swatches": [
      "#000000",
      "#FFFFFF",
      "#E7FA2F",
      "#FCD7EB",
      "#FFABA4"
    ]
  }
];

export const newArrivals: ProductItem[] = [
  {
    "id": "barcelona",
    "title": "Barcelona",
    "handle": "barcelona",
    "category_tag": "Reverb Case",
    "sub_title": "Football",
    "price": 699,
    "compare_at_price": 999,
    "primary_image": "https://www.rezoni.com/cdn/shop/files/3_dc46c3ae-5044-4389-999b-126576050332_950x.jpg?v=1733204519",
    "secondary_image": "https://www.rezoni.com/cdn/shop/files/1_8d5465a5-c2cb-403f-9ad9-8c5fa00e1022_950x.jpg?v=1733204519",
    "swatches": [
      "#000000",
      "#FFFFFF",
      "#E7FA2F",
      "#FCD7EB",
      "#FFABA4"
    ]
  },
  {
    "id": "chelsea",
    "title": "Chelsea",
    "handle": "chelsea",
    "category_tag": "Reverb Case",
    "sub_title": "Football",
    "price": 699,
    "compare_at_price": 999,
    "primary_image": "https://www.rezoni.com/cdn/shop/files/3_b70ce69f-f4f0-4a29-81b1-5f3f9786086e_950x.jpg?v=1733203978",
    "secondary_image": "https://www.rezoni.com/cdn/shop/files/1_e4cd7207-76dc-4ac7-9091-50e51d1c19a9_950x.jpg?v=1733203978",
    "swatches": [
      "#000000",
      "#FFFFFF",
      "#E7FA2F",
      "#FCD7EB",
      "#FFABA4"
    ]
  },
  {
    "id": "arsenal",
    "title": "Arsenal",
    "handle": "arsenal",
    "category_tag": "Reverb Case",
    "sub_title": "Football",
    "price": 699,
    "compare_at_price": 999,
    "primary_image": "https://www.rezoni.com/cdn/shop/files/3_5045f5e9-01c5-45c3-811c-04724b225c2d_950x.jpg?v=1733203667",
    "secondary_image": "https://www.rezoni.com/cdn/shop/files/1_2e85e2e6-ed6f-413b-a2a4-66bab51046a7_950x.jpg?v=1733203666",
    "swatches": [
      "#000000",
      "#FFFFFF",
      "#E7FA2F",
      "#FCD7EB",
      "#FFABA4"
    ]
  },
  {
    "id": "manchester-united",
    "title": "Manchester United",
    "handle": "manchester-united",
    "category_tag": "Reverb Case",
    "sub_title": "Football",
    "price": 699,
    "compare_at_price": 999,
    "primary_image": "https://www.rezoni.com/cdn/shop/files/6_2195dfd1-8886-4c36-afd7-02ecd9630ea6_950x.jpg?v=1733203339",
    "secondary_image": "https://www.rezoni.com/cdn/shop/files/4_feb18307-0220-46ba-acf3-c86c743e9097_950x.jpg?v=1733203339",
    "swatches": [
      "#000000",
      "#FFFFFF",
      "#E7FA2F",
      "#FCD7EB",
      "#FFABA4"
    ]
  },
  {
    "id": "juventus",
    "title": "Juventus",
    "handle": "juventus",
    "category_tag": "Reverb Case",
    "sub_title": "Football",
    "price": 699,
    "compare_at_price": 999,
    "primary_image": "https://www.rezoni.com/cdn/shop/files/6_fc5981f0-970b-438e-b24f-8c8bf6336c0f_950x.jpg?v=1733203020",
    "secondary_image": "https://www.rezoni.com/cdn/shop/files/4_19160534-0b6c-4a76-bb44-c3f073f95f63_950x.jpg?v=1733203020",
    "swatches": [
      "#000000",
      "#FFFFFF",
      "#E7FA2F",
      "#FCD7EB",
      "#FFABA4"
    ]
  },
  {
    "id": "real-madrid",
    "title": "Real Madrid",
    "handle": "real-madrid",
    "category_tag": "Reverb Case",
    "sub_title": "Football",
    "price": 699,
    "compare_at_price": 999,
    "primary_image": "https://www.rezoni.com/cdn/shop/files/3_44c90687-aecb-43f8-9d79-ef6591d19f99_950x.jpg?v=1733202693",
    "secondary_image": "https://www.rezoni.com/cdn/shop/files/1_22b157eb-2aca-4bc4-9c8d-d16edbab73c5_950x.jpg?v=1733202693",
    "swatches": [
      "#000000",
      "#FFFFFF",
      "#E7FA2F",
      "#FCD7EB",
      "#FFABA4"
    ]
  },
  {
    "id": "manchester-city",
    "title": "Manchester City",
    "handle": "manchester-city",
    "category_tag": "Reverb Case",
    "sub_title": "Football",
    "price": 699,
    "compare_at_price": 999,
    "primary_image": "https://www.rezoni.com/cdn/shop/files/3_013734d9-c1c7-4659-bcb1-467fdbd07fd0_950x.jpg?v=1733202401",
    "secondary_image": "https://www.rezoni.com/cdn/shop/files/1_48b73e72-6845-4ff9-8ad3-d93208a7a4cd_950x.jpg?v=1733202400",
    "swatches": [
      "#000000",
      "#FFFFFF",
      "#E7FA2F",
      "#FCD7EB",
      "#FFABA4"
    ]
  },
  {
    "id": "bayern-munich",
    "title": "Bayern Munich",
    "handle": "bayern-munich",
    "category_tag": "Reverb Case",
    "sub_title": "Football",
    "price": 699,
    "compare_at_price": 999,
    "primary_image": "https://www.rezoni.com/cdn/shop/files/6_618f485b-2c50-48e4-bb9c-58bed54605d8_950x.jpg?v=1733202082",
    "secondary_image": "https://www.rezoni.com/cdn/shop/files/4_7adfa8eb-5a19-4971-af4c-f0fedc76ed37_950x.jpg?v=1733202082",
    "swatches": [
      "#000000",
      "#FFFFFF",
      "#E7FA2F",
      "#FCD7EB",
      "#FFABA4"
    ]
  }
];

export const instagramPhotos: InstagramPhoto[] = [
  {
    "id": "ig-1",
    "image": "https://cdn.shopify.com/s/files/1/0621/7829/6040/files/Untitled-1_0000s_0002_IMG_0430_1080x.jpg?v=1671613292",
    "link": "https://www.instagram.com/shoprezoni/"
  },
  {
    "id": "ig-2",
    "image": "https://cdn.shopify.com/s/files/1/0621/7829/6040/files/Untitled-1_0000s_0001_94354FE3-F8B0-42CA-A6D8-BDD8790CBEFD_1080x.jpg?v=1671613245",
    "link": "https://www.instagram.com/shoprezoni/"
  },
  {
    "id": "ig-3",
    "image": "https://cdn.shopify.com/s/files/1/0621/7829/6040/files/Untitled-1_0000s_0003_photo_6109139655262844331_x_1080x.jpg?v=1671613209",
    "link": "https://www.instagram.com/shoprezoni/"
  },
  {
    "id": "ig-4",
    "image": "https://cdn.shopify.com/s/files/1/0621/7829/6040/files/Untitled-1_0000s_0000_IMG_7471_1080x.jpg?v=1671613324",
    "link": "https://www.instagram.com/shoprezoni/"
  }
];
