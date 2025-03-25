// ダミー画像ファイル用のプレースホルダー
const placeholderImage = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22200%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20200%20200%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_1%20text%20%7B%20fill%3A%23AAAAAA%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A10pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_1%22%3E%3Crect%20width%3D%22200%22%20height%3D%22200%22%20fill%3D%22%23EEEEEE%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2274.4296875%22%20y%3D%22104.5%22%3E商品画像%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E';

// テスト用のJANコードリスト
const testJanCodes = [
  { code: '4549526123456', name: 'エディフィス カラーダイヤルシリーズ' },
  { code: '4549526234567', name: 'G-SHOCK フルメタル' },
  { code: '4549526345678', name: 'オシアナス' },
  { code: '4974375123456', name: 'アテッサ' },
  { code: '4974375234567', name: 'シチズンコレクション' },
  { code: '4974375345678', name: 'xC クロスシー' },
  { code: '4954628123456', name: 'セイコー プレザージュ' },
  { code: '4954628234567', name: 'セイコー プロスペックス' },
  { code: '4954628345678', name: 'セイコー ルキア' },
  { code: '4954628456789', name: 'セイコー アストロン' }
];

// テスト用のJANコードボタンを生成
function createTestButtons() {
  const container = document.createElement('div');
  container.className = 'test-buttons-container';
  container.style.marginTop = '20px';
  container.style.padding = '10px';
  container.style.backgroundColor = '#f0f0f0';
  container.style.borderRadius = '8px';
  
  const heading = document.createElement('h3');
  heading.textContent = 'テスト用JANコード';
  heading.style.marginBottom = '10px';
  heading.style.fontSize = '14px';
  container.appendChild(heading);
  
  const buttonGrid = document.createElement('div');
  buttonGrid.style.display = 'grid';
  buttonGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(150px, 1fr))';
  buttonGrid.style.gap = '8px';
  
  testJanCodes.forEach(item => {
    const button = document.createElement('button');
    button.textContent = item.name;
    button.className = 'secondary-button';
    button.style.fontSize = '12px';
    button.style.padding = '8px';
    button.style.textAlign = 'left';
    button.style.whiteSpace = 'nowrap';
    button.style.overflow = 'hidden';
    button.style.textOverflow = 'ellipsis';
    
    button.addEventListener('click', () => {
      document.getElementById('jan-code-input').value = item.code;
      document.querySelector('#search-button').click();
    });
    
    buttonGrid.appendChild(button);
  });
  
  container.appendChild(buttonGrid);
  
  // 入力セクションの後に追加
  const inputSection = document.querySelector('.jan-input-section');
  inputSection.parentNode.insertBefore(container, inputSection.nextSibling);
}

// 画像のプレースホルダーを設定
function setupImagePlaceholders() {
  const productImage = document.getElementById('product-image');
  productImage.src = placeholderImage;
  productImage.alt = '商品画像';
}

// アクセシビリティ設定パネルを追加
function addAccessibilityPanel() {
  const panel = document.createElement('div');
  panel.className = 'accessibility-panel';
  panel.style.position = 'fixed';
  panel.style.bottom = '20px';
  panel.style.right = '20px';
  panel.style.backgroundColor = 'white';
  panel.style.padding = '10px';
  panel.style.borderRadius = '50%';
  panel.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
  panel.style.zIndex = '1000';
  panel.style.cursor = 'pointer';
  
  const icon = document.createElement('span');
  icon.className = 'material-icons';
  icon.textContent = 'accessibility';
  icon.style.fontSize = '24px';
  icon.style.color = '#2196F3';
  
  panel.appendChild(icon);
  
  // 設定メニュー
  const menu = document.createElement('div');
  menu.className = 'accessibility-menu';
  menu.style.position = 'absolute';
  menu.style.bottom = '60px';
  menu.style.right = '0';
  menu.style.backgroundColor = 'white';
  menu.style.padding = '15px';
  menu.style.borderRadius = '8px';
  menu.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
  menu.style.width = '250px';
  menu.style.display = 'none';
  
  // 設定オプション
  const options = [
    { id: 'high-contrast', label: '高コントラストモード', className: 'high-contrast' },
    { id: 'wide-spacing', label: '文字間隔を広げる', className: 'wide-spacing' },
    { id: 'large-text', label: '文字を大きくする', className: 'large-text' }
  ];
  
  const heading = document.createElement('h3');
  heading.textContent = '表示設定';
  heading.style.marginBottom = '10px';
  heading.style.fontSize = '16px';
  menu.appendChild(heading);
  
  options.forEach(option => {
    const optionContainer = document.createElement('div');
    optionContainer.style.display = 'flex';
    optionContainer.style.alignItems = 'center';
    optionContainer.style.marginBottom = '10px';
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = option.id;
    checkbox.style.marginRight = '10px';
    
    const label = document.createElement('label');
    label.htmlFor = option.id;
    label.textContent = option.label;
    
    checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
        document.body.classList.add(option.className);
      } else {
        document.body.classList.remove(option.className);
      }
    });
    
    optionContainer.appendChild(checkbox);
    optionContainer.appendChild(label);
    menu.appendChild(optionContainer);
  });
  
  panel.appendChild(menu);
  
  // クリックでメニュー表示切替
  panel.addEventListener('click', (e) => {
    if (e.target !== checkbox) {
      menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
    }
  });
  
  document.body.appendChild(panel);
}

// DOMが読み込まれたら実行
document.addEventListener('DOMContentLoaded', () => {
  // テスト用ボタンを追加
  createTestButtons();
  
  // 画像プレースホルダーを設定
  setupImagePlaceholders();
  
  // アクセシビリティパネルを追加
  addAccessibilityPanel();
});
