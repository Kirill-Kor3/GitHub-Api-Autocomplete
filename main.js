const container = document.querySelector('.container');

function createEl(tag, elClass, text, attribute) {
  const element = document.createElement(tag);
  if (elClass) element.classList.add(elClass);
  if (text) element.textContent = text;
  if (attribute) attribute.forEach((el) => element.setAttribute(el[0], el[1]));
  return element;
}

const search = createEl('div', 'search');
container.append(search);

const searchRepositories = createEl('form', 'search-repositories');
search.append(searchRepositories);

const searchRepositoriesInput = createEl(
  'input',
  'search-repositories__input',
  [
    ['type', 'text'],
    ['placeholder', 'Поиск...'],
  ]
);
searchRepositories.append(searchRepositoriesInput);

const repositoriesList = createEl('div', 'repositories-list');
search.append(repositoriesList);

const repositories = createEl('div', 'repositories');
container.append(repositories);

const repositoriesMenu = createEl('nav', 'repositories__menu');
repositories.append(repositoriesMenu);

function searchRep() {
  const input = document.querySelector('.search-repositories__input');

  const fetchSearch = async (value) => {
    repositoriesList.innerHTML = '';
    const response = await fetch(
      `https://api.github.com/search/repositories?q=${value}`
    );
    const data = await response.json();
    const res = data.items.filter((el, i) => i < 5);

    res.forEach((el) => {
      const repositoriesListLink = createEl(
        'a',
        'repositories-list__link',
        el.name
      );
      repositoriesList.append(repositoriesListLink);
      repositoriesListLink.addEventListener('click', () => {
        const repositoriesMenuItem = createEl('div', 'repositories__menu-item');
        repositoriesMenu.append(repositoriesMenuItem);

        const repositoriesMenuList = createEl('ul', 'repositories__menu-list');
        repositoriesMenuItem.append(repositoriesMenuList);

        const repositoriesMenuItemDelete = createEl(
          'div',
          'repositories__menu-item-delete'
        );
        repositoriesMenuItem.append(repositoriesMenuItemDelete);

        const repositoriesMenuListItemName = createEl(
          'li',
          'repositories__menu-list-item',
          `Name: ${el.name}`
        );
        const repositoriesMenuListItemOwner = createEl(
          'li',
          'repositories__menu-list-item',
          `Owner: ${el.owner.login}`
        );
        const repositoriesMenuListItemStars = createEl(
          'li',
          'repositories__menu-list-item',
          `Stars: ${el.stargazers_count}`
        );
        repositoriesMenuList.append(
          repositoriesMenuListItemName,
          repositoriesMenuListItemOwner,
          repositoriesMenuListItemStars
        );
        repositoriesMenuItem.addEventListener('click', (e) => {
          if (e.target.classList.contains('repositories__menu-item-delete')) {
            repositoriesMenuItem.remove();
          }
        });
      });
    });
  };

  function debounce(cb, ms) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => cb.apply(this, args), ms);
    };
  }

  function change(e) {
    fetchSearch(e.target.value);
  }

  const onChange = debounce(change, 300);

  input.addEventListener('keyup', onChange);
}
searchRep();
