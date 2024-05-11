export interface Campaigns {
  information: {
    name: string;
    describe?: string;
  };
  subCampaigns: SubCampaign[];
}

export interface SubCampaign {
  name: string;
  status: boolean;
  ads: Ad[];
}

export interface Ad {
  name: string;
  quantity: number;
}

export const initCampaign: Campaigns[] = [
  {
    information: {
      name: '',
      describe: '',
    },
    subCampaigns: [
      {
        name: 'Chiến dịch con 1',
        status: true,
        ads: [
          {
            name: 'Quảng cáo 1',
            quantity: 0,
          },
        ],
      },
    ],
  }
];