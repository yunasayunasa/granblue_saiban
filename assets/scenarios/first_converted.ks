; first.ks - エンジン用に変換
; スタートシナリオ（プロローグ + キャラ選択）

; 動的アセット宣言

@asset type=image key=enzan path=assets/images/enzan.jpg
@asset type=image key=roger_normal path=assets/images/roger_normal.png
@asset type=image key=roger_smile path=assets/images/roger_smile.png

*start
    ; プロローグ開始
    [stopbgm]
    [playbgm storage="cafe" loop="true"]
    [bg storage="enzan" time="1000"]
    [wait time=1000]

    #
    君は、見たこともない空間にいる。
    [r]
    幻想的な一面の花畑、
    [r]
    とても現実とは思えない。
    [p]

    [chara_show name="roger" storage="roger_normal" x="200" y="150"]

    #ロジャー
    おはよう！お呼びとあらば即参上できない！
    [r]
    今日も今日とて限界勤務上等の
    [r]
    オロロジャイアちゃんでっす！
    [p]

    ｵﾎﾝｴﾍﾝ...!ここは演算世界。
    [r]
    僕の力で作り出された世界。
    [r]
    あらゆる可能性を探るための場所さ。
    [p]

    これから君には僕と一緒に
    [r]
    旅をしてもらいたいんだ。
    [p]

    そう！君がチョコをもらえる世界を
    [r]
    探り出す為に！
    [p]

    そんな訳で早速行ってみよう〜！
    [r]
    と言っても...僕は一緒に行ける訳ではないんだけどね！
    [r]
    社畜の悲しみ！
    [p]

    代わりにガチャ回させてあげるから許して！
    [p]
    はい！10連ガチャガチャっとね！
    [p]

    [chara_hide name="roger" time="500" wait="true"]

    #
    1人の仲間が目の前に現れる。
    [p]

    #？？？
    それじゃあ、団長ちゃん、一緒に行こっか♪
    [p]

    #
    仲間になったのは...
    [l]

    ; 選択肢
    [link target="*narumia_route_start" text="ナルメア"]
    [link target="*siete_route_start" text="シエテ"]
    [link target="*hard_mode_start" text="誰も仲間にしない"]
    [link target="*fenny_route_start" text="フェニー"]
    [r]
    [s]

; ----- 各ルートへの分岐 -----
*narumia_route_start
    #ナルメア
    よろしくね、団長ちゃん！
    [p]
    #
    （ナルメアルートは現在準備中です）
    [p]
    [s]

*siete_route_start
    #シエテ
    やあ、団長ちゃん。俺と行くのかい？
    [p]
    #
    （シエテルートは現在準備中です）
    [p]
    [s]

*hard_mode_start
    [chara_show name="roger" x="200" y="150"]
    #ロジャー
    え！？誰もいらない！？
    [p]
    まぁ、君がそういうなら…
    [r]
    …その先は地獄だよ？
    [p]
    [chara_hide name="roger" time="500" wait="true"]
    #
    （ハードモードは現在準備中です）
    [p]
    [s]

*fenny_route_start
    #フェニー
    団長さんとお出かけ楽しみなんだよ！
    [p]
    #
    （フェニールートは現在準備中です）
    [p]
    [s]
