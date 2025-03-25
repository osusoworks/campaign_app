// QuaggaJSのCDNからのインポート（実際の実装時にはローカルファイルを使用）
document.write('<script src="https://cdn.jsdelivr.net/npm/@ericblade/quagga2/dist/quagga.min.js"></script>');

// アプリケーションのメインクラス
class CampaignApp {
    constructor() {
        this.products = [];
        this.campaigns = [];
        this.productCampaigns = [];
        this.currentProduct = null;
        this.initElements();
        this.initEventListeners();
        this.loadData();
    }

    // DOM要素の初期化
    initElements() {
        // 入力関連
        this.janCodeInput = document.getElementById('jan-code-input');
        this.scanButton = document.getElementById('scan-button');
        this.searchButton = document.getElementById('search-button');
        this.barcodeScannerContainer = document.getElementById('barcode-scanner-container');
        this.closeScanner = document.getElementById('close-scanner');
        
        // 表示セクション
        this.productInfoSection = document.getElementById('product-info-section');
        this.campaignsSection = document.getElementById('campaigns-section');
        this.notFoundSection = document.getElementById('not-found-section');
        
        // 商品情報表示要素
        this.productImage = document.getElementById('product-image');
        this.productName = document.getElementById('product-name');
        this.productBrand = document.getElementById('product-brand');
        this.productCategory = document.getElementById('product-category');
        this.productPrice = document.getElementById('product-price');
        
        // キャンペーン表示コンテナ
        this.applicableCampaigns = document.getElementById('applicable-campaigns');
        this.nonApplicableCampaigns = document.getElementById('non-applicable-campaigns');
        
        // テンプレート
        this.campaignCardTemplate = document.getElementById('campaign-card-template');
    }

    // イベントリスナーの初期化
    initEventListeners() {
        this.searchButton.addEventListener('click', () => this.searchProduct());
        this.janCodeInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchProduct();
            }
        });
        
        this.scanButton.addEventListener('click', () => this.toggleBarcodeScanner());
        this.closeScanner.addEventListener('click', () => this.stopBarcodeScanner());
    }

    // データの読み込み
    async loadData() {
        try {
            // 実際の実装では、サーバーからデータを取得するか、ローカルのJSONファイルを読み込む
            const productsResponse = await fetch('../data/sample_products.json');
            const campaignsResponse = await fetch('../data/sample_campaigns.json');
            const productCampaignsResponse = await fetch('../data/sample_product_campaigns.json');
            
            const productsData = await productsResponse.json();
            const campaignsData = await campaignsResponse.json();
            const productCampaignsData = await productCampaignsResponse.json();
            
            this.products = productsData.products;
            this.campaigns = campaignsData.campaigns;
            this.productCampaigns = productCampaignsData.product_campaigns;
            
            console.log('データの読み込みが完了しました');
        } catch (error) {
            console.error('データの読み込み中にエラーが発生しました:', error);
            alert('データの読み込みに失敗しました。ページを再読み込みしてください。');
        }
    }

    // JANコードで商品を検索
    searchProduct() {
        const janCode = this.janCodeInput.value.trim();
        
        if (!janCode) {
            alert('JANコードを入力してください');
            return;
        }
        
        // JANコードの形式チェック（13桁の数字）
        if (!/^\d{13}$/.test(janCode)) {
            alert('JANコードは13桁の数字で入力してください');
            return;
        }
        
        const product = this.products.find(p => p.jan_code === janCode);
        
        if (product) {
            this.currentProduct = product;
            this.displayProductInfo(product);
            this.displayCampaigns(janCode);
            
            // 表示セクションの切り替え
            this.productInfoSection.style.display = 'block';
            this.campaignsSection.style.display = 'block';
            this.notFoundSection.style.display = 'none';
        } else {
            // 商品が見つからない場合
            this.currentProduct = null;
            this.productInfoSection.style.display = 'none';
            this.campaignsSection.style.display = 'none';
            this.notFoundSection.style.display = 'block';
        }
    }

    // 商品情報の表示
    displayProductInfo(product) {
        this.productName.textContent = product.name;
        this.productBrand.textContent = product.brand;
        this.productCategory.textContent = `${product.category} / ${product.sub_category}`;
        this.productPrice.textContent = `¥${product.tax_included_price.toLocaleString()} (税込)`;
        
        // 画像の設定（実際の実装では商品画像のパスを使用）
        this.productImage.src = product.image_url || 'images/no-image.jpg';
        this.productImage.alt = product.name;
    }

    // キャンペーン情報の表示
    displayCampaigns(janCode) {
        // 表示をクリア
        this.applicableCampaigns.innerHTML = '';
        this.nonApplicableCampaigns.innerHTML = '';
        
        // 商品に関連するキャンペーン情報を取得
        const relatedCampaigns = this.productCampaigns.filter(pc => pc.jan_code === janCode);
        
        if (relatedCampaigns.length === 0) {
            // キャンペーンがない場合のメッセージ
            const noApplicableMsg = document.createElement('p');
            noApplicableMsg.textContent = 'この商品に適用可能なキャンペーンはありません。';
            this.applicableCampaigns.appendChild(noApplicableMsg);
            
            const noNonApplicableMsg = document.createElement('p');
            noNonApplicableMsg.textContent = '適用対象外のキャンペーンはありません。';
            this.nonApplicableCampaigns.appendChild(noNonApplicableMsg);
            return;
        }
        
        // 適用可能なキャンペーンと適用対象外のキャンペーンを分ける
        const applicable = relatedCampaigns.filter(pc => pc.is_applicable);
        const nonApplicable = relatedCampaigns.filter(pc => !pc.is_applicable);
        
        // 適用可能なキャンペーンの表示
        if (applicable.length > 0) {
            applicable.forEach(pc => {
                const campaign = this.campaigns.find(c => c.campaign_id === pc.campaign_id);
                if (campaign) {
                    const campaignCard = this.createCampaignCard(campaign, pc, true);
                    this.applicableCampaigns.appendChild(campaignCard);
                }
            });
        } else {
            const noApplicableMsg = document.createElement('p');
            noApplicableMsg.textContent = 'この商品に適用可能なキャンペーンはありません。';
            this.applicableCampaigns.appendChild(noApplicableMsg);
        }
        
        // 適用対象外のキャンペーンの表示
        if (nonApplicable.length > 0) {
            nonApplicable.forEach(pc => {
                const campaign = this.campaigns.find(c => c.campaign_id === pc.campaign_id);
                if (campaign) {
                    const campaignCard = this.createCampaignCard(campaign, pc, false);
                    this.nonApplicableCampaigns.appendChild(campaignCard);
                }
            });
        } else {
            const noNonApplicableMsg = document.createElement('p');
            noNonApplicableMsg.textContent = '適用対象外のキャンペーンはありません。';
            this.nonApplicableCampaigns.appendChild(noNonApplicableMsg);
        }
    }

    // キャンペーンカードの作成
    createCampaignCard(campaign, productCampaign, isApplicable) {
        const template = this.campaignCardTemplate.content.cloneNode(true);
        const card = template.querySelector('.campaign-card');
        
        // 適用可能かどうかによってクラスを追加
        card.classList.add(isApplicable ? 'applicable' : 'non-applicable');
        
        // カードの内容を設定
        card.querySelector('.campaign-title').textContent = campaign.name;
        card.querySelector('.campaign-period').textContent = `期間: ${campaign.start_date} 〜 ${campaign.end_date}`;
        card.querySelector('.campaign-description').textContent = campaign.short_description;
        
        // 注意事項の設定
        const notesList = card.querySelector('.notes-list');
        if (campaign.notes && campaign.notes.length > 0) {
            campaign.notes.slice(0, 3).forEach(note => {
                const li = document.createElement('li');
                li.textContent = note;
                notesList.appendChild(li);
            });
            
            // 注意事項が3つ以上ある場合は「もっと見る」ボタンを追加
            if (campaign.notes.length > 3) {
                const moreButton = document.createElement('button');
                moreButton.textContent = 'もっと見る';
                moreButton.className = 'secondary-button';
                moreButton.style.fontSize = 'var(--font-size-xs)';
                moreButton.style.padding = 'var(--spacing-xs) var(--spacing-sm)';
                moreButton.style.marginTop = 'var(--spacing-xs)';
                
                moreButton.addEventListener('click', () => {
                    // 既存の注意事項をクリア
                    notesList.innerHTML = '';
                    
                    // すべての注意事項を表示
                    campaign.notes.forEach(note => {
                        const li = document.createElement('li');
                        li.textContent = note;
                        notesList.appendChild(li);
                    });
                    
                    // ボタンを非表示にする
                    moreButton.style.display = 'none';
                });
                
                card.querySelector('.campaign-notes').appendChild(moreButton);
            }
        } else {
            const li = document.createElement('li');
            li.textContent = '特記事項はありません。';
            notesList.appendChild(li);
        }
        
        // 適用理由または除外理由の設定
        const reasonElement = card.querySelector('.campaign-reason');
        if (isApplicable) {
            reasonElement.textContent = `適用理由: ${productCampaign.application_reason}`;
        } else {
            reasonElement.textContent = `除外理由: ${productCampaign.exclusion_reason}`;
        }
        
        return card;
    }

    // バーコードスキャナーの表示/非表示切り替え
    toggleBarcodeScanner() {
        if (this.barcodeScannerContainer.style.display === 'none') {
            this.barcodeScannerContainer.style.display = 'block';
            this.initBarcodeScanner();
        } else {
            this.stopBarcodeScanner();
        }
    }

    // バーコードスキャナーの初期化
    initBarcodeScanner() {
        Quagga.init({
            inputStream: {
                name: "Live",
                type: "LiveStream",
                target: document.querySelector("#barcode-scanner"),
                constraints: {
                    width: 480,
                    height: 320,
                    facingMode: "environment"
                },
            },
            decoder: {
                readers: ["ean_reader"]
            }
        }, (err) => {
            if (err) {
                console.error('バーコードスキャナーの初期化に失敗しました:', err);
                alert('カメラへのアクセスに失敗しました。カメラの使用許可を確認してください。');
                this.barcodeScannerContainer.style.display = 'none';
                return;
            }
            
            console.log('バーコードスキャナーが初期化されました');
            Quagga.start();
            
            Quagga.onDetected(this.onBarcodeDetected.bind(this));
        });
    }

    // バーコードが検出されたときの処理
    onBarcodeDetected(result) {
        const code = result.codeResult.code;
        console.log('バーコードが検出されました:', code);
        
        // スキャナーを停止
        this.stopBarcodeScanner();
        
        // 検出されたJANコードを入力欄に設定
        this.janCodeInput.value = code;
        
        // 商品検索を実行
        this.searchProduct();
    }

    // バーコードスキャナーの停止
    stopBarcodeScanner() {
        if (Quagga.initialized) {
            Quagga.stop();
            console.log('バーコードスキャナーを停止しました');
        }
        this.barcodeScannerContainer.style.display = 'none';
    }
}

// DOMが読み込まれたらアプリケーションを初期化
document.addEventListener('DOMContentLoaded', () => {
    const app = new CampaignApp();
});
