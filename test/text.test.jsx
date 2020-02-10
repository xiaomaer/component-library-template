import React from 'react';
import { shallow } from 'enzyme';
import Text from '../components/text';

describe('# Component Text', () => {
    it('应该正确得到文本内容', () => {
        const wrapper = shallow(<Text.Money value={123123123} />);
        expect(wrapper.find('div').text()).toBe('123,123,123');
    });

    it('应该正确得到文本内容', () => {
        const wrapper = shallow(<Text.Money value={0} />);
        expect(wrapper.find('div').text()).toBe('0');
    });

    it('应该正确得到文本内容', () => {
        const wrapper = shallow(<Text.Money value={''} />);
        expect(wrapper.find('div').text()).toBe('0');
    });

    it('应该正确得到文本内容', () => {
        const wrapper = shallow(<Text.Money value={1000} />);
        expect(wrapper.find('div').text()).toBe('1,000');
    });

    it('应该正确得到文本内容', () => {
        const wrapper = shallow(<Text.Money value={1000.001} />);
        expect(wrapper.find('div').text()).toBe('1,000.001');
    });

    it('应该正确得到文本内容', () => {
        const wrapper = shallow(<Text.Money value={'asdf'} />);
        expect(wrapper.find('div').text()).toBe('0');
    });

    it('应该正确得到文本内容', () => {
        const wrapper = shallow(<Text.Money value={'10.00.001'} />);
        expect(wrapper.find('div').text()).toBe('0');
    });
});
