import { useContext } from 'react';
import OperatorButton from '../components/OperatorButton';
import Toggle from '../components/setting/Toggle';
import { PageContext } from '../models/context';

const TIME_OPTIONS = [
    {
        name: '关闭',
        value: false,
    },
    {
        name: '开启',
        value: true,
    },
];

const Setting = () => {
    const context = useContext(PageContext);

    return (
        <>
            <header className="ow-header-middle">{context.state.router}</header>
            <main className="ow-content-middle">
                <div className="ow-main">
                    <section className="ow-section">
                        <header className="ow-section-header">数据显示</header>
                        <Toggle
                            label="显示时间"
                            value={context.setting.time}
                            options={TIME_OPTIONS}
                            onChange={(value) =>
                                context.setSetting('time', value)
                            }
                        />
                    </section>
                </div>
                <OperatorButton
                    className="ow-right-bottom-button"
                    keyName="ESC"
                    onClick={context.history.pop}
                >
                    返回
                </OperatorButton>
            </main>
        </>
    );
};

export default Setting;
