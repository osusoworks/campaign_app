// 完全に修正されたapp.js - 検索機能の問題を解決
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM読み込み完了 - スクリプト実行開始');
    
    // ベースパスを取得（GitHub Pages対応）
    const basePath = window.location.pathname.replace(/\/[^/]*$/, '');
    console.log('ベースパス:', basePath);
    
    // DOM要素
    const janCodeInput = document.querySelector('input[placeholder="JANコードを入力"]');
    const searchButton = document.querySelector('button.search-button') || document.querySelector('button:contains("検索")');
    const scanButton = document.querySelector('button#scan-button') || document.querySelector('button:contains("qr_code_scanner")');
    
    // 結果表示用のセクション
    let productInfoSection = document.getElementById('product-info-section');
    let campaignsSection = document.getElementById('campaigns-section');
    let notFoundSection = document.getElementById('not-found-section');
    
    // セクションが存在しない場合は作成
    if (!productInfoSection) {
        productInfoSection = document.createElement('section');
        productInfoSection.id = 'product-info-section';
        productInfoSection.style.display = 'none';
        document.querySelector('main').appendChild(productInfoSection);
        
        // 商品情報の基本構造を作成
        productInfoSection.innerHTML = `
            <div class="card">
                <div class="product-header">
                    <img id="product-image" src="" alt="商品画像">
                    <div class="product-details">
                        <h2 id="product-name"></h2>
                        <p><strong>ブランド:</strong> <span id="product-brand"></span></p>
                        <p><strong>カテゴリ:</strong> <span id="product-category"></span></p>
                        <p><strong>価格:</strong> <span id="product-price"></span></p>
                    </div>
                </div>
            </div>
        `;
    }
    
    if (!campaignsSection) {
        campaignsSection = document.createElement('section');
        campaignsSection.id = 'campaigns-section';
        campaignsSection.style.display = 'none';
        document.querySelector('main').appendChild(campaignsSection);
        
        // キャンペーン情報の基本構造を作成
        campaignsSection.innerHTML = `
            <div class="campaigns-container">
                <h2>適用可能なキャンペーン</h2>
                <div id="applicable-campaigns"></div>
                
                <h2>適用対象外のキャンペーン</h2>
                <div id="non-applicable-campaigns"></div>
            </div>
            
            <template id="campaign-card-template">
                <div class="campaign-card">
                    <h3 class="campaign-title"></h3>
                    <p class="campaign-period"></p>
                    <p class="campaign-description"></p>
                    <div class="campaign-notes">
                        <h4>注意事項:</h4>
                        <ul class="notes-list"></ul>
                    </div>
                    <p class="campaign-reason"></p>
                </div>
            </template>
        `;
    }
    
    if (!notFoundSection) {
        notFoundSection = document.createElement('section');
        notFoundSection.id = 'not-found-section';
        notFoundSection.style.display = 'none';
        document.querySelector('main').appendChild(notFoundSection);
        
        // 商品が見つからない場合のメッセージ
        notFoundSection.innerHTML = `
            <div class="not-found-container">
                <div class="not-found-icon">search</div>
                <p>商品が見つかりませんでした。</p>
                <p>JANコードを確認して再度お試しください。</p>
            </div>
        `;
    }
    
    console.log('DOM要素の初期化完了');
    
    // 商品データとキャンペーンデータ
    let productsData = [];
    let campaignsData = [];
    let productCampaignsData = [];
    
    // インラインデータを使用
    console.log('インラインデータを使用します');
    
    // 商品データ
    productsData = [
        {
            "jan": "4549526123456",
            "name": "エディフィス カラーダイヤルシリーズ EFR-123",
            "brand": "CASIO",
            "category": "腕時計 / エディフィス",
            "price": 38500,
            "image": "images/edifice.jpg"
        },
        {
            "jan": "4549526789012",
            "name": "G-SHOCK フルメタル GMW-B5000",
            "brand": "CASIO",
            "category": "腕時計 / G-SHOCK",
            "price": 64000,
            "image": "images/gshock.jpg"
        },
        {
            "jan": "4549526345678",
            "name": "オシアナス OCW-S100",
            "brand": "CASIO",
            "category": "腕時計 / オシアナス",
            "price": 74000,
            "image": "images/oceanus.jpg"
        },
        {
            "jan": "4974375123456",
            "name": "アテッサ AT8040",
            "brand": "CITIZEN",
            "category": "腕時計 / アテッサ",
            "price": 74800,
            "image": "images/attesa.jpg"
        },
        {
            "jan": "4974375789012",
            "name": "シチズンコレクション BM6770",
            "brand": "CITIZEN",
            "category": "腕時計 / シチズンコレクション",
            "price": 29000,
            "image": "images/collection.jpg"
        },
        {
            "jan": "4974375345678",
            "name": "xC クロスシー EC1144",
            "brand": "CITIZEN",
            "category": "腕時計 / xC",
            "price": 52000,
            "image": "images/xc.jpg"
        },
        {
            "jan": "4954628123456",
            "name": "セイコー プレザージュ SARX033",
            "brand": "SEIKO",
            "category": "腕時計 / プレザージュ",
            "price": 85000,
            "image": "images/presage.jpg"
        },
        {
            "jan": "4954628789012",
            "name": "セイコー プロスペックス SBDC001",
            "brand": "SEIKO",
            "category": "腕時計 / プロスペックス",
            "price": 63000,
            "image": "images/prospex.jpg"
        },
        {
            "jan": "4954628345678",
            "name": "セイコー ルキア SSQV001",
            "brand": "SEIKO",
            "category": "腕時計 / ルキア",
            "price": 57000,
            "image": "images/lukia.jpg"
        },
        {
            "jan": "4954628901234",
            "name": "セイコー アストロン SBXC001",
            "brand": "SEIKO",
            "category": "腕時計 / アストロン",
            "price": 187000,
            "image": "images/astron.jpg"
        }
    ];
    
    // キャンペーンデータ
    campaignsData = [
        {
            "id": "casio_warranty",
            "name": "カシオ保証延長キャンペーン",
            "period": "2025-03-14 ~ 2025-04-06",
            "description": "保証期間1年延長無料",
            "notes": [
                "レジ操作の際に、延長保証1年分を通常通り押して、金額を0円で訂正してください",
                "3年保証・4年保証へ延長する場合は、必ず差額を頂いてください（3年保証：差額1,100円、4年保証：差額2,200円）",
                "対象商品を接客時には、保証が無料で延長されることを必ずお伝えください"
            ]
        },
        {
            "id": "citizen_warranty",
            "name": "シチズン保証延長キャンペーン",
            "period": "2025-02-21 ~ 2025-03-23",
            "description": "保証期間1年延長無料",
            "notes": [
                "レジ操作の際に、延長保証1年分を通常通り押して、金額を0円で訂正してください",
                "3年保証・4年保証へ延長する場合は、必ず差額を頂いてください（3年保証：差額1,100円、4年保証：差額2,200円）",
                "対象商品を接客時には、保証が無料で延長されることを必ずお伝えください"
            ]
        },
        {
            "id": "citizen_interest_free",
            "name": "シチズン分割金利無料キャンペーン",
            "period": "2025-02-21 ~ 2025-03-23",
            "description": "分割払い最大30回まで金利無料",
            "notes": [
                "通常通りジャックスのページよりお客様入力などを実施してください",
                "申し込みで不明なことがあれば、必ずジャックスの担当者へ確認してください",
                "シチズン商品のみ、ジャックスローンでの購入で、売上の1%をインセンティブ支給"
            ]
        },
        {
            "id": "freshers_discount",
            "name": "フレッシャーズ割引キャンペーン",
            "period": "2025-02-25 ~ 2025-04-06",
            "description": "学生・新社会人限定 最大20%OFF",
            "notes": [
                "学生・新社会人の見分けについては、自己申告となります",
                "接客時に対象と思われるお客様であれば、ご案内して頂いて売上に繋げて頂いても構いません",
                "学生本人の来店が必須となります。本人不在でのギフト購入は対象外となります"
            ]
        },
        {
            "id": "seiko_gift_card",
            "name": "セイコー商品券プレゼント",
            "period": "2025-03-01 ~ 2025-03-31",
            "description": "対象商品購入で5,000円分の商品券プレゼント",
            "notes": [
                "対象商品購入時に商品券をお渡しください",
                "在庫には限りがあります。なくなり次第終了となります",
                "商品券の使用期限は2025年6月30日までです"
            ]
        },
        {
            "id": "anniversary_70th",
            "name": "創業70周年特別ご招待企画",
            "period": "2025-03-20 ~ 2025-03-23",
            "description": "事前予約で約10%分のお買物券進呈",
            "notes": [
                "3月19日までに事前予約されたお客様が対象です",
                "対象商品は、売価税込み33,000円以上の腕時計（店頭割引後価格）です",
                "当日予約なしでの来店は、対象外となります"
            ]
        }
    ];
    
    // 商品-キャンペーン関連データ
    productCampaignsData = [
        {
            "jan": "4549526123456",
            "campaigns": [
                {
                    "campaign_id": "casio_warranty",
                    "applicable": true,
                    "reason": "エディフィスカラーダイヤルシリーズの対象商品"
                },
                {
                    "campaign_id": "freshers_discount",
                    "applicable": true,
                    "reason": "学生・新社会人の方が対象"
                },
                {
                    "campaign_id": "anniversary_70th",
                    "applicable": true,
                    "reason": "事前予約で対象"
                }
            ]
        },
        {
            "jan": "4549526789012",
            "campaigns": [
                {
                    "campaign_id": "casio_warranty",
                    "applicable": true,
                    "reason": "G-SHOCKフルメタルシリーズの対象商品"
                },
                {
                    "campaign_id": "freshers_discount",
                    "applicable": true,
                    "reason": "学生・新社会人の方が対象"
                },
                {
                    "campaign_id": "anniversary_70th",
                    "applicable": true,
                    "reason": "事前予約で対象"
                }
            ]
        },
        {
            "jan": "4549526345678",
            "campaigns": [
                {
                    "campaign_id": "casio_warranty",
                    "applicable": true,
                    "reason": "オシアナスシリーズの対象商品"
                },
                {
                    "campaign_id": "freshers_discount",
                    "applicable": false,
                    "reason": "高級ラインのため対象外"
                },
                {
                    "campaign_id": "anniversary_70th",
                    "applicable": true,
                    "reason": "事前予約で対象"
                }
            ]
        },
        {
            "jan": "4974375123456",
            "campaigns": [
                {
                    "campaign_id": "citizen_warranty",
                    "applicable": true,
                    "reason": "アテッサシリーズの対象商品"
                },
                {
                    "campaign_id": "citizen_interest_free",
                    "applicable": true,
                    "reason": "シチズン商品はジャックスローンで30回まで金利無料"
                },
                {
                    "campaign_id": "freshers_discount",
                    "applicable": true,
                    "reason": "学生・新社会人の方が対象"
                },
                {
                    "campaign_id": "anniversary_70th",
                    "applicable": true,
                    "reason": "事前予約で対象"
                }
            ]
        },
        {
            "jan": "4974375789012",
            "campaigns": [
                {
                    "campaign_id": "citizen_warranty",
                    "applicable": true,
                    "reason": "シチズンコレクションの対象商品"
                },
                {
                    "campaign_id": "citizen_interest_free",
                    "applicable": true,
                    "reason": "シチズン商品はジャックスローンで30回まで金利無料"
                },
                {
                    "campaign_id": "freshers_discount",
                    "applicable": true,
                    "reason": "学生・新社会人の方が対象"
                },
                {
                    "campaign_id": "anniversary_70th",
                    "applicable": false,
                    "reason": "価格帯が対象外"
                }
            ]
        },
        {
            "jan": "4974375345678",
            "campaigns": [
                {
                    "campaign_id": "citizen_warranty",
                    "applicable": true,
                    "reason": "xCシリーズの対象商品"
                },
                {
                    "campaign_id": "citizen_interest_free",
                    "applicable": true,
                    "reason": "シチズン商品はジャックスローンで30回まで金利無料"
                },
                {
                    "campaign_id": "freshers_discount",
                    "applicable": true,
                    "reason": "学生・新社会人の方が対象"
                },
                {
                    "campaign_id": "anniversary_70th",
                    "applicable": true,
                    "reason": "事前予約で対象"
                }
            ]
        },
        {
            "jan": "4954628123456",
            "campaigns": [
                {
                    "campaign_id": "seiko_gift_card",
                    "applicable": true,
                    "reason": "セイコープレザージュの対象商品"
                },
                {
                    "campaign_id": "freshers_discount",
                    "applicable": true,
                    "reason": "学生・新社会人の方が対象"
                },
                {
                    "campaign_id": "anniversary_70th",
                    "applicable": true,
                    "reason": "事前予約で対象"
                }
            ]
        },
        {
            "jan": "4954628789012",
            "campaigns": [
                {
                    "campaign_id": "seiko_gift_card",
                    "applicable": true,
                    "reason": "セイコープロスペックスの対象商品"
                },
                {
                    "campaign_id": "freshers_discount",
                    "applicable": true,
                    "reason": "学生・新社会人の方が対象"
                },
                {
                    "campaign_id": "anniversary_70th",
                    "applicable": true,
                    "reason": "事前予約で対象"
                }
            ]
        },
        {
            "jan": "4954628345678",
            "campaigns": [
                {
                    "campaign_id": "seiko_gift_card",
                    "applicable": true,
                    "reason": "セイコールキアの対象商品"
                },
                {
                    "campaign_id": "freshers_discount",
                    "applicable": true,
                    "reason": "学生・新社会人の方が対象"
                },
                {
                    "campaign_id": "anniversary_70th",
                    "applicable": true,
                    "reason": "事前予約で対象"
                }
            ]
        },
        {
            "jan": "4954628901234",
            "campaigns": [
                {
                    "campaign_id": "seiko_gift_card",
                    "applicable": false,
                    "reason": "高級ラインのため対象外"
                },
                {
                    "campaign_id": "freshers_discount",
                    "applicable": false,
                    "reason": "高級ラインのため対象外"
                },
                {
                    "campaign_id": "anniversary_70th",
                    "applicable": true,
                    "reason": "事前予約で対象"
                }
            ]
        }
    ];
    
    console.log('データの初期化完了');
    
    // 検索ボタンのイベントリスナー
    if (searchButton) {
        console.log('検索ボタンにイベントリスナーを設定');
        searchButton.addEventListener('click', function() {
            console.log('検索ボタンがクリックされました');
            searchProduct();
        });
    } else {
        console.error('検索ボタンが見つかりません');
    }
    
    // JANコード入力欄でEnterキーを押したときの処理
    if (janCodeInput) {
        console.log('JANコード入力欄にイベントリスナーを設定');
        janCodeInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                console.log('Enterキーが押されました');
                searchProduct();
            }
        });
    } else {
        console.error('JANコード入力欄が見つかりません');
    }
    
    // 商品検索関数
    function searchProduct() {
        console.log('searchProduct関数が呼び出されました');
        
        if (!janCodeInput) {
            console.error('JANコード入力欄が見つかりません');
            return;
        }
        
        const janCode = janCodeInput.value.trim();
        console.log('検索するJANコード:', janCode);
        
        if (!janCode) {
            alert('JANコードを入力してください');
            return;
        }
        
        const product = productsData.find(p => p.jan === janCode);
        console.log('検索結果:', product);
        
        if (product) {
            displayProductInfo(product);
            displayCampaignInfo(product.jan);
        } else {
            showNotFoundMessage();
        }
    }
    
    // 商品情報表示関数
    function displayProductInfo(product) {
        console.log('displayProductInfo関数が呼び出されました:', product);
        
        if (!productInfoSection || !campaignsSection || !notFoundSection) {
            console.error('表示セクションが見つかりません');
            return;
        }
        
        // 商品情報セクションを表示
        productInfoSection.style.display = 'block';
        campaignsSection.style.display = 'block';
        notFoundSection.style.display = 'none';
        
        // 商品情報を設定
        const productName = document.getElementById('product-name');
        const productBrand = document.getElementById('product-brand');
        const productCategory = document.getElementById('product-category');
        const productPrice = document.getElementById('product-price');
        const productImage = document.getElementById('product-image');
        
        if (productName) productName.textContent = product.name;
        if (productBrand) productBrand.textContent = product.brand;
        if (productCategory) productCategory.textContent = product.category;
        if (productPrice) productPrice.textContent = `¥${product.price.toLocaleString()} (税込)`;
        
        // 商品画像を設定（画像がある場合）
        if (productImage) {
            if (product.image) {
                productImage.src = product.image;
                productImage.alt = product.name;
            } else {
                productImage.src = 'images/no-image.jpg';
                productImage.alt = 'No Image';
            }
        }
        
        console.log('商品情報の表示完了');
    }
    
    // キャンペーン情報表示関数
    function displayCampaignInfo(janCode) {
        console.log('displayCampaignInfo関数が呼び出されました:', janCode);
        
        const applicableCampaignsContainer = document.getElementById('applicable-campaigns');
        const nonApplicableCampaignsContainer = document.getElementById('non-applicable-campaigns');
        
        if (!applicableCampaignsContainer || !nonApplicableCampaignsContainer) {
            console.error('キャンペーン表示コンテナが見つかりません');
            return;
        }
        
        // コンテナをクリア
        applicableCampaignsContainer.innerHTML = '';
        nonApplicableCampaignsContainer.innerHTML = '';
        
        // 商品に関連するキャンペーン情報を取得
        const productCampaigns = productCampaignsData.find(pc => pc.jan === janCode);
        console.log('商品に関連するキャンペーン:', productCampaigns);
        
        if (productCampaigns && productCampaigns.campaigns) {
            // 適用可能なキャンペーンと適用対象外のキャンペーンを分ける
            const applicable = [];
            const nonApplicable = [];
            
            productCampaigns.campaigns.forEach(pc => {
                const campaign = campaignsData.find(c => c.id === pc.campaign_id);
                if (campaign) {
                    if (pc.applicable) {
                        applicable.push({ campaign, reason: pc.reason });
                    } else {
                        nonApplicable.push({ campaign, reason: pc.reason });
                    }
                }
            });
            
            console.log('適用可能なキャンペーン:', applicable);
            console.log('適用対象外のキャンペーン:', nonApplicable);
            
            // 適用可能なキャンペーンを表示
            if (applicable.length > 0) {
                applicable.forEach(item => {
                    const campaignCard = createCampaignCard(item.campaign, item.reason, true);
                    applicableCampaignsContainer.appendChild(campaignCard);
                });
            } else {
                applicableCampaignsContainer.innerHTML = '<p class="no-campaigns">適用可能なキャンペーンはありません。</p>';
            }
            
            // 適用対象外のキャンペーンを表示
            if (nonApplicable.length > 0) {
                nonApplicable.forEach(item => {
                    const campaignCard = createCampaignCard(item.campaign, item.reason, false);
                    nonApplicableCampaignsContainer.appendChild(campaignCard);
                });
            } else {
                nonApplicableCampaignsContainer.innerHTML = '<p class="no-campaigns">適用対象外のキャンペーンはありません。</p>';
            }
        } else {
            // キャンペーン情報がない場合
            applicableCampaignsContainer.innerHTML = '<p class="no-campaigns">適用可能なキャンペーンはありません。</p>';
            nonApplicableCampaignsContainer.innerHTML = '<p class="no-campaigns">適用対象外のキャンペーンはありません。</p>';
        }
        
        console.log('キャンペーン情報の表示完了');
    }
    
    // キャンペーンカード作成関数
    function createCampaignCard(campaign, reason, isApplicable) {
        console.log('createCampaignCard関数が呼び出されました:', campaign.name);
        
        // テンプレートからクローン
        const template = document.getElementById('campaign-card-template');
        if (!template) {
            console.error('キャンペーンカードテンプレートが見つかりません');
            
            // テンプレートがない場合は直接作成
            const card = document.createElement('div');
            card.className = `campaign-card ${isApplicable ? 'applicable' : 'non-applicable'}`;
            
            const title = document.createElement('h3');
            title.className = 'campaign-title';
            title.textContent = campaign.name;
            
            const period = document.createElement('p');
            period.className = 'campaign-period';
            period.textContent = `期間: ${campaign.period}`;
            
            const description = document.createElement('p');
            description.className = 'campaign-description';
            description.textContent = campaign.description;
            
            const notesContainer = document.createElement('div');
            notesContainer.className = 'campaign-notes';
            
            const notesTitle = document.createElement('h4');
            notesTitle.textContent = '注意事項:';
            
            const notesList = document.createElement('ul');
            notesList.className = 'notes-list';
            
            campaign.notes.forEach((note, index) => {
                if (index < 2 || campaign.notes.length <= 3) {
                    const li = document.createElement('li');
                    li.textContent = note;
                    notesList.appendChild(li);
                }
            });
            
            const reasonElement = document.createElement('p');
            reasonElement.className = `campaign-reason ${isApplicable ? 'applicable-reason' : 'non-applicable-reason'}`;
            reasonElement.textContent = `適用理由: ${reason}`;
            
            notesContainer.appendChild(notesTitle);
            notesContainer.appendChild(notesList);
            
            card.appendChild(title);
            card.appendChild(period);
            card.appendChild(description);
            card.appendChild(notesContainer);
            card.appendChild(reasonElement);
            
            // 注意事項が3つ以上ある場合は「もっと見る」ボタンを追加
            if (campaign.notes.length > 3) {
                const moreButton = document.createElement('button');
                moreButton.textContent = 'もっと見る';
                moreButton.className = 'more-button';
                moreButton.addEventListener('click', function() {
                    // 既存の注意事項をクリア
                    notesList.innerHTML = '';
                    
                    // すべての注意事項を表示
                    campaign.notes.forEach(note => {
                        const li = document.createElement('li');
                        li.textContent = note;
                        notesList.appendChild(li);
                    });
                    
                    // ボタンを非表示
                    this.style.display = 'none';
                });
                
                notesContainer.appendChild(moreButton);
            }
            
            return card;
        }
        
        const campaignCard = document.importNode(template.content, true).querySelector('.campaign-card');
        
        // 適用可否によってクラスを追加
        campaignCard.classList.add(isApplicable ? 'applicable' : 'non-applicable');
        
        // キャンペーン情報を設定
        campaignCard.querySelector('.campaign-title').textContent = campaign.name;
        campaignCard.querySelector('.campaign-period').textContent = `期間: ${campaign.period}`;
        campaignCard.querySelector('.campaign-description').textContent = campaign.description;
        
        // 注意事項を設定
        const notesList = campaignCard.querySelector('.notes-list');
        campaign.notes.forEach((note, index) => {
            if (index < 2 || campaign.notes.length <= 3) {
                const li = document.createElement('li');
                li.textContent = note;
                notesList.appendChild(li);
            }
        });
        
        // 注意事項が3つ以上ある場合は「もっと見る」ボタンを追加
        if (campaign.notes.length > 3) {
            const moreButton = document.createElement('button');
            moreButton.textContent = 'もっと見る';
            moreButton.className = 'more-button';
            moreButton.addEventListener('click', function() {
                // 既存の注意事項をクリア
                notesList.innerHTML = '';
                
                // すべての注意事項を表示
                campaign.notes.forEach(note => {
                    const li = document.createElement('li');
                    li.textContent = note;
                    notesList.appendChild(li);
                });
                
                // ボタンを非表示
                this.style.display = 'none';
            });
            
            campaignCard.querySelector('.campaign-notes').appendChild(moreButton);
        }
        
        // 適用理由を設定
        const reasonElement = campaignCard.querySelector('.campaign-reason');
        reasonElement.textContent = `適用理由: ${reason}`;
        reasonElement.className = `campaign-reason ${isApplicable ? 'applicable-reason' : 'non-applicable-reason'}`;
        
        return campaignCard;
    }
    
    // 商品が見つからない場合のメッセージ表示
    function showNotFoundMessage() {
        console.log('showNotFoundMessage関数が呼び出されました');
        
        if (!productInfoSection || !campaignsSection || !notFoundSection) {
            console.error('表示セクションが見つかりません');
            return;
        }
        
        productInfoSection.style.display = 'none';
        campaignsSection.style.display = 'none';
        notFoundSection.style.display = 'block';
        
        console.log('商品が見つからないメッセージを表示');
    }
    
    // テスト用JANコードボタンのイベントリスナー設定
    console.log('テスト用JANコードボタンのイベントリスナーを設定');
    document.querySelectorAll('.test-jan-button').forEach(button => {
        button.addEventListener('click', function() {
            console.log('テスト用JANコードボタンがクリックされました:', this.textContent);
            
            // ボタンのテキストに基づいて商品を検索
            const buttonText = this.textContent.trim();
            let selectedProduct = null;
            
            if (buttonText.includes('エディフィス')) {
                selectedProduct = productsData.find(p => p.name.includes('エディフィス'));
            } else if (buttonText.includes('G-SHOCK')) {
                selectedProduct = productsData.find(p => p.name.includes('G-SHOCK'));
            } else if (buttonText.includes('オシアナス')) {
                selectedProduct = productsData.find(p => p.name.includes('オシアナス'));
            } else if (buttonText.includes('アテッサ')) {
                selectedProduct = productsData.find(p => p.name.includes('アテッサ'));
            } else if (buttonText.includes('シチズンコレクション')) {
                selectedProduct = productsData.find(p => p.name.includes('シチズンコレクション'));
            } else if (buttonText.includes('クロスシー')) {
                selectedProduct = productsData.find(p => p.name.includes('クロスシー'));
            } else if (buttonText.includes('プレザージュ')) {
                selectedProduct = productsData.find(p => p.name.includes('プレザージュ'));
            } else if (buttonText.includes('プロスペックス')) {
                selectedProduct = productsData.find(p => p.name.includes('プロスペックス'));
            } else if (buttonText.includes('ルキア')) {
                selectedProduct = productsData.find(p => p.name.includes('ルキア'));
            } else if (buttonText.includes('アストロン')) {
                selectedProduct = productsData.find(p => p.name.includes('アストロン'));
            }
            
            if (selectedProduct) {
                console.log('選択された商品:', selectedProduct);
                janCodeInput.value = selectedProduct.jan;
                searchProduct();
            } else {
                console.error('商品が見つかりません:', buttonText);
            }
        });
    });
    
    console.log('スクリプトの初期化完了');
    
    // 初期状態では結果表示セクションを非表示
    if (productInfoSection) productInfoSection.style.display = 'none';
    if (campaignsSection) campaignsSection.style.display = 'none';
    if (notFoundSection) notFoundSection.style.display = 'none';
});
