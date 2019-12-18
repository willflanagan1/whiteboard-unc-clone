import React from 'react';
import { CATEGORIES } from '../../../constants/categories';
import { Menu, Affix } from 'antd';
const { SubMenu } = Menu;

const getCategories = (categoryObject) => {
  let componentList = [];
  let i = 0;
  if (typeof categoryObject === 'object'
    && categoryObject !== null
    && Object.keys(categoryObject).length > 0) {
      for (let key of Object.keys(categoryObject)) {
        let subCategory = CATEGORIES[key];
        if (typeof subCategory === 'object'
          && subCategory !== null
          && Object.keys(subCategory).length > 0) {
          let subCategoryList = [];
          subCategoryList.push(Object.keys(subCategory).map((subSubCategory) => {
            i++;
            return getCategories(subSubCategory);
          }));
          componentList.push(<SubMenu key={key + i} title={key}>{subCategoryList}</SubMenu>);
        } else {
          return <Menu.Item key={subCategory + i}>{subCategory}</Menu.Item>;
        }
        i++;
      }
    } else {
      return <Menu.Item key={categoryObject + i}>{categoryObject}</Menu.Item>;
    }
  return componentList;
}

const Sidenav = () => (
  <Affix>
  <Menu
    mode="inline"
    style={{ minHeight: '100vh', borderRight: 0 }}
  >
  {getCategories(CATEGORIES)}
  </Menu>
  </Affix>
);

export default Sidenav;
