; hard_scenario.ks - エンジン用に変換
; ハードモード

; 動的アセット宣言
@asset type=image key=enzan path=assets/images/enzan.jpg
@asset type=image key=roger_normal path=assets/images/roger_normal.png

*auguste_arrival
    [bg storage="bgtest" time="1000"]
    [playbgm storage="cafe" loop="true"]
    #
    君はアウギュステに降り立った。[br]街はバレンタイン一色に染まり、右を見ても左を見ても、[br]チョコを共に送り合う恋人達で溢れていた。[br]嫉嫉の炎が胸を焦がす。このままでは狂ってしまうだろう。
    [p]

    君は...
    [l]

    ; 選択肢
    [link target="*dash_to_sea" text="海までダッシュ！"]
    [link target="*shopping_mindlessly_badend" text="無心で買い物へ"]
    [link target="*return_to_ship_badend" text="船に戻る"]
    [r]
    [s]

*return_to_ship_badend 
    [bg storage="bgtest2" time="500"]
    君は船に戻った。
    [p]
    ムードに気圧され、圧倒された。
    [p]
    自分の情けなさに嫌気がさし、君は膝を抱えたまま、眠りに落ちた。
    [p]
    BAD END 
    [l]
    [jump storage="TitleScene"]
    [s]

*shopping_mindlessly_badend 
    [bg storage="bgtest3" time="500"]
    君は無心で買い物へ出かけた。
    [p]
    正気保てる訳がない。[br]君は叫んだ、心の底から。[br]誰かが、肩に手を置いた。「事案ですか？」
    [p]
    BAD END 
    [l]
    [jump storage="TitleScene"]
    [s]

*dash_to_sea 
    君は海まで走った。
    [p]
    海に着いた君は、無心で剣を振りつづけた。
    [p]
    1000回━ 君の素振りは、音を置き去りにしていた。
    [p]

    そんな君の前に現れたのは...
    [l]

    ; 選択肢
    [link target="*thugs_appear_badend_hard" text="荒くれ者達"] 
    [link target="*sea_creatures_appear_hard" text="海のトンチキ生物達"]
    [link target="*lowain_appear_badend_hard" text="ローアイン達"]
    [r]
    [s]

*thugs_appear_badend_hard 
    君の前に現れたのは荒くれ者達だった。
    [p]
    #荒くれ者
    こんなとこで剣なんか振ってんじゃねえよ！あぶねえだろうが！
    [p]
    #
    ...正論を振りかざされ、君は心が折れた。
    [p]
    BAD END 
    [l]
    [jump storage="TitleScene"]
    [s]

*lowain_appear_badend_hard 
    君の前に現れたのはローアイン達だった。
    [p]
    #ローアイン
    あれ？ﾀﾞﾝﾁｮ？こんなとこで剣なんか振っちゃってDoしたん？
    [p]
    #
    君はローアイン達と海の家でダベることにした。
    [p]
    妄想トークが捗り、非常に楽しい1日を過ごした━
    [p]
    #ロジャー
    ちょちょちょい！待って！チョコ忘れてない！？再演算！
    [p]
    BAD END
    [l]
    [s]

*sea_creatures_appear_hard 
    [playbgm storage="bgm_action" loop="true"]
    君の前に現れたのは、海のトンチキ生物達だった。
    [p]
    カキフライ、ンニ、カツウォヌス、前から後ろから、左右から、海の生物が襲いかかる。
    [p]
    どれから対処すべきか...
    [l]

    ; 選択肢
    [link target="*failed_battle_badend" text="ンニ"] 
    [link target="*progress_battle_1" text="カツウォヌス"] 
    [link target="*failed_battle_badend" text="カキフライ"] 
    [r]
    [s]

*failed_battle_badend 
    [stopbgm] 
    君は目を覚ました。見知った天井、自分の部屋だ。
    [p]
    どうやら選択を誤ったらしい。
    [p]
    BAD END 
    [l]
    [s]

*progress_battle_1 
    [playse storage="smash" stop="false"]
    まずは1つ、次は━
    [p]
    サメ、アルバコア、増援。君は選択を迫られる...
    [l]

    ; 次の選択肢
    [link target="*final_battle_badend" text="ンナギ"]
    [link target="*final_battle_badend" text="ンニ"]
    [link target="*final_battle_badend" text="アルバコア"]
    [link target="*final_battle_badend" text="煉獄カツウォヌス"] 
    [r]
    [s]

*final_battle_badend
    クァニ、灼弩火罹、ゾンビィ、更に増える生物達。
    [p]
    無理だ。1人では━ [br]君は押し迫る海の生物達の中に消えていった...。
    [p]
    [stopbgm] 
    [link target="*pseudo_prologue_start" text="再演算する"] 
    [link target="*start_return_title" text="あきらめる"]
    [r]
    [s]

*start_return_title
    [jump storage="TitleScene"]
    [s]

*pseudo_prologue_start
    [playbgm storage="cafe" loop="true"] 
    [bg storage="enzan" time="1000"]
    #
    君は、どこか見覚えのある空間にいる。
    [p]

    [chara_show name="roger" storage="roger" pos="center"]
    おはよう！お呼びとあらば即参上できない！[br]ここは演算世界。あらゆる可能性を探るための場所さ。
    [p]
    君がチョコをもらえる世界を探り出す為に、早速行ってみよう〜！
    [p]
    [chara_hide name="roger" time="500" wait="true"]

    #
    1人の仲間が目の前に現れる。
    [p]
    それじゃあ、団長ちゃん、一緒に行こっか♪
    [p]
    仲間になったのは...
    [l]

    ; 選択肢
    [link target="*pseudo_select_true_route" text="ナルメア"]
    [link target="*pseudo_select_siete" text="シエテ"]
    [link target="*pseudo_select_hard" text="誰も仲間にしない"]
    [r]
    [s]

*pseudo_select_true_route
    #ナルメア
    ...どうしてあなたもいるのかな？
    [p]
    #シエテ
    まぁまぁ、団長ちゃんには俺たちの両方の力が必要みたいだからね。
    [p]
    「「それじゃあ、一緒に行こっか、団長ちゃん！」」
    [p]
    [jump target="*true_ending"]

*pseudo_select_siete
    [s]

*pseudo_select_hard
    [jump target="*auguste_arrival"]

*true_ending 
    [playbgm storage="night_bgm" loop="true"]
    #ルリア
    チョコを司る星晶獣なんて、びっくりです〜！あむっ！[br]はい！これ、どうぞ！ハッピーバレンタイン♪
    [p]
    ～HAPPY END～
    [p]
    #ロジャー
    うんうん、やっぱり最後はハッピーエンドよね！[br]ゲームブック【演算世界とチヨコレイト】 ～完～
    [l]
    [jump storage="TitleScene"]
    [s]
