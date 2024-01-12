import Switch from '@mui/joy/Switch';
import * as React from 'react';
import { CiLight } from 'react-icons/ci';
import { MdDarkMode } from 'react-icons/md';
import { useAppDispatch, useAppSelector } from '../redux/stote';
import { UtilActions } from '../redux/util.slice';
import { ThemeEnum } from '../types/util.type';


export default function ThemeToggleSwitch() {
    const { themeState } = useAppSelector(state => state.util)
    const dispatch = useAppDispatch()
    const toggleTheme = (theme: ThemeEnum) => {
        dispatch(UtilActions.setThemeState(theme))
    }

    return (
        <Switch
            color={themeState === ThemeEnum.LIGHT ? 'primary' : 'danger'}
            slotProps={{ input: { 'aria-label': 'dark mode' } }}
            startDecorator={
                <MdDarkMode style={{ color: themeState === ThemeEnum.LIGHT ? 'red' : '#000' }} />



            }
            endDecorator={
                < CiLight
                    style={{ color: themeState === ThemeEnum.LIGHT ? 'red' : '#000' }}
                />

            }
            checked={themeState === ThemeEnum.LIGHT}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                toggleTheme(event.target.checked ? ThemeEnum.LIGHT : ThemeEnum.DARK)
            }
        />

    );
}