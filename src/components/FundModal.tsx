import {  useEffect } from 'react';
import { Modal, Form, Input, InputNumber,Button} from 'antd';
import type { LocalFund } from '../types';

interface Props {
    open:boolean;
    onClose:() => void;
    onSubmit:(values: LocalFund) => void;
    initialValues?:LocalFund;
}

export const FundModal = ({open,onClose,onSubmit,initialValues} :Props) =>{
    const [form] = Form.useForm();


    useEffect(() => {
        if(open){
            if (initialValues){
                form.setFieldsValue(initialValues);
            }else{
                form.resetFields();
            }
        }   
    },[open,initialValues,form]);

    const handleFinish = (value:LocalFund) => {
        onSubmit(value);
        onClose();
        form.resetFields();
    }

    return (
        <Modal 
        title="添加/加仓基金" 
        open={open} 
        onCancel={onClose} 
        footer={null} // 不需要默认的确定取消按钮，我们在 Form 里写了
        >
            <Form form={form} onFinish={handleFinish} layout="vertical">
                <Form.Item 
                name="code" 
                label="基金代码" 
                rules={[{ required: true, message: '请输入代码' }, { len: 6, message: '代码必须是6位' }]}
                >
                    {/* 使用 Input 防止前导 0 丢失 */}
                    <Input placeholder="例如：017435" maxLength={6} allowClear />
                </Form.Item>

                <Form.Item 
                name="costPrice" 
                label="持仓成本价(元)" 
                rules={[{ required: true, message: '请输入成本' }]}
                >
                    <InputNumber style={{ width: '100%' }} step={0.0001} placeholder="例如：1.0500" />
                </Form.Item>

                <Form.Item 
                name="amount" 
                label="投入金额(元)" 
                rules={[{ required: true, message: '请输入金额' }]}
                >
                    <InputNumber style={{ width: '100%' }} step={100} placeholder="例如：1000" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        确认提交
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );

}