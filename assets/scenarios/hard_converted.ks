*auguste_arrival
    ; キャラクター定義
    [chara_new name="roger" jname="ロジャー"]
    [chara_new name="fenny" jname="フェニー"]
    [chara_new name="narumia" jname="ナルメア"]
    [chara_new name="siete" jname="シエテ"]
    [chara_new name="thug" jname="荒くれ者"]
    [chara_new name="lowain" jname="ローアイン"]
    [chara_new name="kaki" jname="カキフライ"]
    [chara_new name="nni" jname="ンニ"]
    [chara_new name="katuo" jname="カツウォヌス"]
    [chara_new name="same" jname="サメ"]
    [chara_new name="koa" jname="アルバコア"]
    [chara_new name="chocokoa" jname="チョコアルバコア"]
    [chara_new name="zombie" jname="ゾンビィ"]
    [chara_new name="ruria" jname="ルリア"]
    [chara_new name="oigen" jname="三羽烏"]
    [chara_new name="wilnas" jname="ウィルナス"]
    [chara_new name="luoh" jname="ル・オー"]
    [chara_new name="wamdus" jname="ワムデュス"]
    [chara_new name="galleon" jname="ガレオン"]
    [chara_new name="sandalphon" jname="サンダルフォン"]
    [chara_new name="diantha" jname="ディアンサ"]
    [chara_new name="anthuria" jname="アンスリア"]
    [chara_new name="nier" jname="ニーア"]
    [chara_new name="death" jname="デス"]

    [bg storage="bgtest" time="1000"]
    [playbgm storage="cafe" loop="true"]
    #
    君はアウギュステに降り立った。[br]街はバレンタイン一色に染まり、右を見ても左を見ても、[br]チョコを共に送り合う恋人達で溢れていた。
    [p]
    「ねぇ、まりっぺ！これ美味しそう！」
    [p]
    「メグ...！これってカップル専用の...！[br]そんなに私の事を...！」
    [p]
    「ジュリエット、君にこのチョコ指輪を贈らせてくれ！」
    [p]
    「ロミオ...！」
    [p]
    嫉妬の炎が胸を焦がす。このままでは狂ってしまうだろう。
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
    自分の情けなさに嫌気がさし、
    [p]
    君は膝を抱えたまま、眠りに落ちた。
    [p]
    BAD END 
    [l]
    [jump storage="first_converted.ks" target="*start"]
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
    [chara_show name="thug" storage="thug_normal" pos="center"]
    #荒くれ者
    こんなとこで剣なんか振ってんじゃねえよ！あぶねえだろうが！
    [p]
    #
    ...正論を振りかざされ、君は心が折れた。
    [p]
    [chara_hide name="thug" time="300" wait="true"]
    BAD END 
    [l]
    [jump storage="TitleScene"]
    [s]

*lowain_appear_badend_hard 
    [chara_show name="lowain" storage="lowain_normal" pos="center"]
    #ローアイン
    あれ？ﾀﾞﾝﾁｮ？こんなとこで剣なんか振っちゃってDoしたん？
    [p]
    #
    君はローアイン達と海の家でダベることにした。
    [p]
    妄想トークが捗り、非常に楽しい1日を過ごした━
    [p]
    [chara_hide name="lowain" time="300" wait="true"]
    [chara_show name="roger" storage="roger_normal" pos="center" time="500" wait="true"]
    #ロジャー
    ちょちょちょい！待って！チョコ忘れてない！？再演算！
    [p]
    [chara_hide name="roger" time="300" wait="true"]
    BAD END
    [l]
    [s]

*sea_creatures_appear_hard 
    [playbgm storage="bgm_action" loop="true"]
    [chara_show name="kaki" storage="kaki" pos="left"]
    [chara_show name="nni" storage="nni" pos="right"]
    [chara_show name="katuo" storage="katuo" pos="center"]
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
    #ルリア
    大丈夫ですか？[br]今、ティコさんを呼んできますね！
    [p]
    [chara_hide name="ruria" time="300" wait="true"]
    #
    どうやら選択を誤ったらしい。
    [p]
    BAD END 
    [l]
    [s]

*progress_battle_1 
    [chara_hide name="katuo" time="200"]
    [chara_show name="same" storage="same" pos="left"]
    [chara_show name="koa" storage="koa" pos="right"]
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
    [chara_show name="zombie" storage="zombie" pos="center"]
    #ゾンビィ
    「ドライブイン！とっ！りっ！」
    [p]
    [chara_hide name="zombie" time="300" wait="true"]
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

    [chara_show name="roger" storage="roger_normal" pos="center"]
    #ロジャー
    おはよう！お呼びとあらば即参上できない！[br]ここは演算世界。あらゆる可能性を探るための場所さ。
    [p]
    君がチョコをもらえる世界を探り出す為に、早速行ってみよう〜！
    [p]
    [chara_hide name="roger" time="500" wait="true"]

    ; --- カットイン演出 (手動展開) ---
    [chara_show name="roger" pos="center" time="50"]
    [wait time="50"]
    [chara_hide name="roger" time="50"]
    [chara_show name="narumia" pos="center" time="50"]
    [wait time="50"]
    [chara_hide name="narumia" time="50"]
    [chara_show name="siete" pos="center" time="50"]
    [wait time="50"]
    [chara_hide name="siete" time="50"]
    [chara_show name="sandalphon" pos="center" time="50"]
    [wait time="50"]
    [chara_hide name="sandalphon" time="50"]
    [chara_show name="diantha" pos="center" time="50"]
    [wait time="50"]
    [chara_hide name="diantha" time="50"]
    [chara_show name="anthuria" pos="center" time="50"]
    [wait time="50"]
    [chara_hide name="anthuria" time="50"]
    [chara_show name="nier" pos="center" time="50"]
    [wait time="50"]
    [chara_hide name="nier" time="50"]
    [chara_show name="oigen" pos="center" time="50"]
    [wait time="50"]
    [chara_hide name="oigen" time="50"]
    [chara_show name="wilnas" pos="center" time="50"]
    [wait time="50"]
    [chara_hide name="wilnas" time="50"]
    [chara_show name="luoh" pos="center" time="50"]
    [wait time="50"]
    [chara_hide name="luoh" time="50"]
    [chara_show name="wamdus" pos="center" time="50"]
    [wait time="50"]
    [chara_hide name="wamdus" time="50"]
    [chara_show name="galleon" pos="center" time="50"]
    [wait time="50"]
    [chara_hide name="galleon" time="50"]
    [chara_show name="lowain" pos="center" time="50"]
    [wait time="50"]
    [chara_hide name="lowain" time="50"]
    [chara_show name="thug" pos="center" time="50"]
    [wait time="50"]
    [chara_hide name="thug" time="50"]
    [chara_show name="ruria" pos="center" time="100"]
    [wait time="500"]

    [playse storage="smash" stop="false"]
    「1人じゃない！」
    [p]
    [chara_hide name="ruria" time="200" wait="true"]

    ; 仲間たちの加勢
    [chara_show name="oigen" pos="center" time="300"]
    #三羽烏
    「「「ソイヤッ！」」」
    [p]
    [chara_hide name="oigen" time="200" wait="true"]

    [chara_show name="wilnas" pos="center" time="300"]
    #ウィルナス
    「殲滅、殲滅！」
    [p]
    [chara_hide name="wilnas" time="200" wait="true"]

    [chara_show name="wamdus" pos="center" time="300"]
    #ワムデュス
    「ワム、お腹すいた...全部食べる。」
    [p]
    [chara_hide name="wamdus" time="200" wait="true"]

    [chara_show name="sandalphon" pos="center" time="300"]
    #サンダルフォン
    「アイン•ソフ•オウル！」
    [p]
    [chara_hide name="sandalphon" time="200" wait="true"]

    #
    [chara_show name="chocokoa" storage="chocokoa" pos="center"]
    チョコ•アルバコア「チョコオオオオオオオオオオオオ━━━！！」
    [p]
    [chara_hide name="chocokoa" time="300" wait="true"]

    [chara_show name="ruria" pos="center" time="500"]
    #ルリア
    ...！目の中にもう一つ星晶獣の気配を感じます！
    [p]
    [chara_hide name="ruria" time="200" wait="true"]

    最後の選択だ、君は...
    [p]

    [link target="*true_ending" text="目を狙う"]
    [link target="*failed_battle_badend" text="ヒレを狙う"]
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
    [chara_show name="ruria" storage="ruria_normal" pos="center" time="1000" wait="true"]
    #ルリア
    チョコを司る星晶獣なんて、びっくりです〜！あむっ！[br]はい！これ、どうぞ！ハッピーバレンタイン♪
    [p]
    ～HAPPY END～
    [p]
    [chara_hide name="ruria" time="500" wait="true"]
    [chara_show name="roger" storage="roger_normal" pos="center" time="500" wait="true"]
    #ロジャー
    うんうん、やっぱり最後はハッピーエンドよね！[br]ゲームブック【演算世界とチヨコレイト】 ～完～
    [l]
    [jump storage="TitleScene"]
    [s]
