import cities from '../../mock-data/cities-states.json';

export type CitySelectOptionType = {
    label: string;
    value: string;
    state: string;
};

export const cityOptions = cities.map((item) => ({
    label: item.City,
    value: item.City,
    state: item.State,
}));
