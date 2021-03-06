import React, { useState, useRef, useEffect } from 'react';
import TweenOneGroup from 'rc-tween-one/lib/TweenOneGroup';
import {
    Tag,
    Input,
    Form,
    // eslint-disable-next-line import/named
    InputRef,
    Button,
    Typography,
    Tooltip,
    Spin,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useTranslation } from '../../../../hooks/useTranslation';
import { NS_ADMIN_PANEL, NS_COMMON } from '../../../../const/NAMESPACES';
import styles from './ComparisonEntityCategory.module.less';
import { useComparisonEntity } from '../../../../context/ComparisonEntityContext';

const PAGE_SIZE = 200;

const ComparisonEntityCategory: React.FC = () => {
    const {
        onLoadEntitiesCategories,
        entityCategoriesPaginate,
        onAddEntityCategory,
        onDeleteEntityCategory,
    } = useComparisonEntity();
    const [form] = Form.useForm();

    useEffect(() => {
        onLoadEntitiesCategories({
            limit: PAGE_SIZE,
            page: 1,
        });
    },[]);


    const { t } = useTranslation(NS_ADMIN_PANEL);
    const { t:tc } = useTranslation(NS_COMMON);

    const [tagsState, setTagsState] = useState({
        inputVisible: false,
        inputValue: '',
    });

    const saveInputRef = useRef<InputRef>(null);

    useEffect(() => {
        if (tagsState.inputVisible) {
            saveInputRef?.current?.focus();
        }
    }, [tagsState.inputVisible]);

    const showInput = () => {
        setTagsState((c) => ({
            ...c,
            inputVisible: true,
        }));
    };

    const handleInputChange = (e: { target: { value: any; }; }) => {
        setTagsState((c) => ({
            ...c,
            inputValue: e.target.value,
        }));
    };

    const handleInputConfirm = (values:Record<string, string>) => {

        onAddEntityCategory({
            title: values.title,
            description: values.description,
        });

        form.resetFields();

        setTagsState({
            inputVisible: false,
            inputValue: '',
        });
    };

    return (
        <div>
            <Typography.Title
                level={2}
            >
                {t('comparisonEntitiesCategories.entitiesCategories')}
            </Typography.Title>
            <>
                <div style={{ marginBottom: 16 }}>
                    <TweenOneGroup
                        enter={{
                            scale: 0.8,
                            opacity: 0,
                            type: 'from',
                            duration: 100,
                        }}
                        onEnd={(e:any) => {
                            if (e.type === 'appear' || e.type === 'enter') {
                                if (e.target && e.target.style) {
                                    e.target.style = 'display: inline-block';
                                }
                            }
                        }}
                        leave={{ opacity: 0, width: 0, scale: 0, duration: 200 }}
                        appear={false}
                    >
                        {entityCategoriesPaginate.items.map((category) => (
                            <span
                                key={category.id}
                                style={{ display: 'inline-block' }}
                            >
                                <Tooltip placement="topLeft" title={category.description}>
                                    <Tag
                                        closable={!category.isFetching}
                                        onClose={e => {
                                            e.preventDefault();
                                            onDeleteEntityCategory({ comparisonEntityCategoryId: category.id as string });
                                        }}
                                        className={styles.tag}
                                    >
                                        {category.title}
                                        {category.isFetching && (
                                            <Spin
                                                size='small'
                                            />
                                        )}
                                    </Tag>
                                </Tooltip>

                            </span>
                        ))}
                    </TweenOneGroup>
                </div>
                {tagsState.inputVisible && (
                    <Form
                        name="addCategory"
                        onFinish={handleInputConfirm}
                        form={form}
                    >
                        <Form.Item
                            name='title'
                            rules={[{
                                required: true,
                                message: tc('formErrors.empty', { fieldName: t('comparisonEntitiesCategories.name.label') })
                            }]}
                        >
                            <Input
                                ref={saveInputRef}
                                type="text"
                                size="small"
                                style={{ width: 150 }}
                                value={tagsState.inputValue}
                                onChange={handleInputChange}
                                placeholder={t('comparisonEntitiesCategories.name.placeholder')}
                            />
                        </Form.Item>
                        <Form.Item
                            name='description'
                        >
                            <Input
                                type="text"
                                size="small"
                                style={{ width: 150 }}
                                value={tagsState.inputValue}
                                onChange={handleInputChange}
                                placeholder={t('comparisonEntitiesCategories.description.placeholder')}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                            >
                                {t('actions.add')}
                            </Button>
                        </Form.Item>
                    </Form>
                )}
                {!tagsState.inputVisible && (
                    <Tag
                        onClick={showInput}
                        className={styles.plusButton}
                    >
                        <PlusOutlined /> New Tag
                    </Tag>
                )}
            </>
        </div>
    );
};

export default React.memo(ComparisonEntityCategory);
