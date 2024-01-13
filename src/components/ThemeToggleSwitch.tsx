import Switch from '@mui/joy/Switch';

import { MdDarkMode } from 'react-icons/md';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { UtilActions } from '../redux/util.slice';
import { ThemeEnum } from '../types/util.type';

export default function ThemeToggleSwitch() {
    const { themeState } = useAppSelector(state => state.util);
    const dispatch = useAppDispatch();

    const toggleTheme = (theme: ThemeEnum) => {
        dispatch(UtilActions.setThemeState(theme));
    };

    return (


        <Switch
            size="lg"
            slotProps={{
                input: { 'aria-label': themeState === ThemeEnum.DARK ? 'Dark mode' : 'Light mode' },
                thumb: {
                    children: <MdDarkMode />,
                },
            }}
            sx={{
                '--Switch-thumbSize': '16px',
            }}
            checked={themeState === ThemeEnum.DARK}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                toggleTheme(event.target.checked ? ThemeEnum.DARK : ThemeEnum.LIGHT)
            }
        />
    );
}

