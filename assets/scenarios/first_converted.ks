; first.ks - エンジン用に変換
; スタートシナリオ（プロローグ + キャラ選択）

; 動的アセット宣言

@asset type=image key=enzan path=assets/images/enzan.jpg
@asset type=image key=roger_normal path=assets/images/roger_normal.png
@asset type=image key=roger_smile path=assets/images/roger_smile.png

*start
    ; キャラクター定義 (名前と表示名の紐付け)
    [chara_new name="roger" jname="ロジャー"]
    [chara_new name="fenny" jname="フェニー"]
    [chara_new name="narumia" jname="ナルメア"]
    [chara_new name="siete" jname="シエテ"]

    ; プロローグ開始
    [stopbgm]
    [playbgm storage="cafe" loop="true"]
    [bg storage="enzan" time="1000"]
    [wait time=1000]

    君は、見たこともない空間にいる。[br]幻想的な一面の花畑、[br]とても現実とは思えない。
    [p]

    [chara_show name="roger" storage="roger" pos="center"]

    #ロジャー
    おはよう！お呼びとあらば即参上できない！[br]今日も今日とて限界勤務上等の[br]オロロジャイアちゃんでっす！
    [p]

    ｵﾎﾝｴﾍﾝ...!ここは演算世界。[br]僕の力で作り出された世界。[br]あらゆる可能性を探るための場所さ。
    [p]

    これから君には僕と一緒に[br]旅をしてもらいたいんだ。
    [p]
    そう！君がチョコをもらえる世界を[br]探り出す為に！
    [p]

    そんな訳で早速行ってみよう〜！[br]と言っても...僕は一緒に行ける訳ではないんだけどね！[br]社畜の悲しみ！
    [p]

    代わりにガチャ回させてあげるから許して！[br]はい！10連ガチャガチャっとね！
    [p]

    [chara_hide name="roger" time="500" wait="true"]

    
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
    [jump storage="narumia_converted.ks"]

*siete_route_start
    [jump storage="siete_converted.ks"]

*hard_mode_start
    [jump storage="hard_converted.ks"]

*fenny_route_start
    [jump storage="fenny_converted.ks"]
