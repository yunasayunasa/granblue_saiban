; first.ks - エンジン用に変換
; スタートシナリオ（プロローグ + キャラ選択）

*start
    ; プロローグ開始
    [stopbgm]
    [playbgm storage="enzan.mp3" loop="true"]
    [bg storage="calc_space.jpg" time="1000"]
    [wait time=1000]

    #
    君は、見たこともない空間にいる。
    [r]
    幻想的な一面の花畑、
    [r]
    とても現実とは思えない。
    [p]

    [chara_new name="roger" storage="roger_normal.png" jname="ロジャー"]
    [chara_show name="roger" x="200" y="150"]

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
    [chara_new name="narumia" storage="narumia_normal.png" jname="ナルメア"]
    [chara_show name="narumia" time="500" wait="true"]
    #ナルメア
    よろしくね、団長ちゃん！
    [p]
    #
    [jump storage="narumia_scenario.ks" target="*cafe_scene"]

*siete_route_start
    [chara_new name="siete" storage="siete_normal.png" jname="シエテ"]
    [chara_show name="siete" x="150" y="150" time="500" wait="true"]
    #シエテ
    やあ、団長ちゃん。俺と行くのかい？
    [p]
    #
    [jump storage="siete_scenario.ks" target="*deck_scene_start"]

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
    [jump storage="hard_scenario.ks" target="*auguste_arrival"]

*fenny_route_start
    [chara_new name="fenny" storage="fenny_normal.png" jname="フェニー"]
    [chara_show name="fenny" x="150" y="150"]
    #フェニー
    団長さんとお出かけ楽しみなんだよ！
    [p]
    [jump storage="fenny_scenario.ks" target="*port_breeze_arrival"]
